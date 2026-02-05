#!/usr/bin/env python3
"""
Fine-tuning script for the Recruiting Brain outreach model.

Uses Unsloth for efficient LoRA fine-tuning on DeepSeek-R1 or Qwen3 models.
Trains on approved outreach examples to learn the user's style and preferences.

Prerequisites:
    pip install unsloth
    # Or for specific CUDA version:
    pip install "unsloth[cu121]"

Usage:
    python scripts/fine_tune.py --export-data  # Export training data
    python scripts/fine_tune.py --train        # Run fine-tuning
    python scripts/fine_tune.py --merge        # Merge LoRA weights

Environment variables:
    DATABASE_URL: PostgreSQL connection string
    BASE_MODEL: Base model to fine-tune (default: deepseek-ai/DeepSeek-R1-Distill-Qwen-32B)
    OUTPUT_DIR: Directory for model outputs (default: ./models)
"""

import argparse
import json
import os
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent))


def export_training_data(output_path: str, min_quality: float = 0.0):
    """Export approved outreach examples as training data."""
    import asyncio
    from sqlalchemy import select
    from src.database import async_session
    from src.models.outreach import OutreachLog

    async def _export():
        async with async_session() as db:
            result = await db.execute(
                select(OutreachLog).where(
                    OutreachLog.user_final.isnot(None),
                    OutreachLog.user_approved == True,  # noqa: E712
                )
            )
            logs = result.scalars().all()

            training_data = []
            for log in logs:
                # Skip if quality score is set and below threshold
                if log.quality_score is not None and log.quality_score < min_quality:
                    continue

                # Build training example
                example = {
                    "messages": [
                        {
                            "role": "system",
                            "content": _build_system_prompt(log.outreach_type.value),
                        },
                        {
                            "role": "user",
                            "content": _build_user_prompt(log.input_context, log.message_type),
                        },
                        {
                            "role": "assistant",
                            "content": log.user_final,
                        },
                    ]
                }
                training_data.append(example)

            return training_data

    data = asyncio.run(_export())

    # Write as JSONL
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w") as f:
        for example in data:
            f.write(json.dumps(example) + "\n")

    print(f"Exported {len(data)} training examples to {output_path}")
    return len(data)


def _build_system_prompt(outreach_type: str) -> str:
    """Build system prompt for training."""
    return """You are an expert recruiting and business development professional.
Write personalized outreach messages that are authentic, respectful, and effective.
Adapt your style based on the context and recipient."""


def _build_user_prompt(context: dict, message_type: str) -> str:
    """Build user prompt from context."""
    parts = []

    if "job" in context:
        job = context["job"]
        parts.append(f"Job: {job.get('title', '')} at {job.get('company', '')}")

    if "candidate" in context:
        cand = context["candidate"]
        parts.append(f"Candidate: {cand.get('name', '')} - {cand.get('current_title', '')}")

    if "client" in context:
        client = context["client"]
        parts.append(f"Client: {client.get('company_name', '')}")

    parts.append(f"Message type: {message_type}")
    parts.append("Write a personalized outreach message.")

    return "\n".join(parts)


def run_training(
    data_path: str,
    base_model: str,
    output_dir: str,
    max_steps: int = 500,
    learning_rate: float = 2e-4,
    batch_size: int = 2,
    gradient_accumulation: int = 4,
    lora_r: int = 16,
    lora_alpha: int = 16,
):
    """Run LoRA fine-tuning with Unsloth."""
    try:
        from unsloth import FastLanguageModel
        from trl import SFTTrainer
        from transformers import TrainingArguments
        from datasets import load_dataset
    except ImportError:
        print("Error: Unsloth not installed. Install with:")
        print("  pip install unsloth")
        sys.exit(1)

    print(f"Loading base model: {base_model}")

    # Load model with 4-bit quantization
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=base_model,
        max_seq_length=4096,
        dtype=None,  # Auto-detect
        load_in_4bit=True,
    )

    # Add LoRA adapters
    model = FastLanguageModel.get_peft_model(
        model,
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=0.05,
        target_modules=[
            "q_proj", "k_proj", "v_proj", "o_proj",
            "gate_proj", "up_proj", "down_proj",
        ],
        bias="none",
        use_gradient_checkpointing="unsloth",
    )

    # Load training data
    print(f"Loading training data from: {data_path}")
    dataset = load_dataset("json", data_files=data_path, split="train")

    # Format for chat
    def format_chat(example):
        text = tokenizer.apply_chat_template(
            example["messages"],
            tokenize=False,
            add_generation_prompt=False,
        )
        return {"text": text}

    dataset = dataset.map(format_chat)

    # Training arguments
    training_args = TrainingArguments(
        output_dir=output_dir,
        per_device_train_batch_size=batch_size,
        gradient_accumulation_steps=gradient_accumulation,
        learning_rate=learning_rate,
        max_steps=max_steps,
        warmup_steps=50,
        logging_steps=10,
        save_steps=100,
        fp16=True,
        optim="adamw_8bit",
    )

    # Create trainer
    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=4096,
        args=training_args,
    )

    print("Starting training...")
    trainer.train()

    # Save LoRA weights
    lora_path = os.path.join(output_dir, "lora_adapter")
    model.save_pretrained(lora_path)
    tokenizer.save_pretrained(lora_path)

    print(f"LoRA adapter saved to: {lora_path}")
    return lora_path


def merge_weights(base_model: str, lora_path: str, output_path: str):
    """Merge LoRA weights with base model."""
    try:
        from unsloth import FastLanguageModel
    except ImportError:
        print("Error: Unsloth not installed")
        sys.exit(1)

    print(f"Loading base model: {base_model}")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=base_model,
        max_seq_length=4096,
        dtype=None,
        load_in_4bit=True,
    )

    print(f"Loading LoRA adapter: {lora_path}")
    model = FastLanguageModel.get_peft_model(model, r=16)
    model.load_adapter(lora_path)

    print(f"Merging and saving to: {output_path}")
    model.save_pretrained_merged(
        output_path,
        tokenizer,
        save_method="merged_16bit",  # or "merged_4bit" for smaller size
    )

    print("Merge complete!")


def main():
    parser = argparse.ArgumentParser(description="Fine-tune Recruiting Brain model")
    parser.add_argument("--export-data", action="store_true", help="Export training data")
    parser.add_argument("--train", action="store_true", help="Run fine-tuning")
    parser.add_argument("--merge", action="store_true", help="Merge LoRA weights")

    # Data options
    parser.add_argument("--data-path", default="./data/training.jsonl", help="Training data path")
    parser.add_argument("--min-quality", type=float, default=0.0, help="Minimum quality score")

    # Model options
    parser.add_argument(
        "--base-model",
        default=os.environ.get("BASE_MODEL", "deepseek-ai/DeepSeek-R1-Distill-Qwen-32B"),
        help="Base model to fine-tune",
    )
    parser.add_argument("--output-dir", default="./models", help="Output directory")
    parser.add_argument("--lora-path", default="./models/lora_adapter", help="LoRA adapter path")

    # Training options
    parser.add_argument("--max-steps", type=int, default=500, help="Maximum training steps")
    parser.add_argument("--learning-rate", type=float, default=2e-4, help="Learning rate")
    parser.add_argument("--batch-size", type=int, default=2, help="Batch size")

    args = parser.parse_args()

    if args.export_data:
        count = export_training_data(args.data_path, args.min_quality)
        if count < 500:
            print(f"\nWarning: Only {count} examples. Recommend 500+ for effective fine-tuning.")

    elif args.train:
        if not os.path.exists(args.data_path):
            print(f"Error: Training data not found at {args.data_path}")
            print("Run with --export-data first")
            sys.exit(1)

        run_training(
            data_path=args.data_path,
            base_model=args.base_model,
            output_dir=args.output_dir,
            max_steps=args.max_steps,
            learning_rate=args.learning_rate,
            batch_size=args.batch_size,
        )

    elif args.merge:
        merge_output = os.path.join(args.output_dir, "merged_model")
        merge_weights(args.base_model, args.lora_path, merge_output)

    else:
        parser.print_help()


if __name__ == "__main__":
    main()
