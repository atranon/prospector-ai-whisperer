"""Client/prospect management API endpoints."""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.models.client import Client, ClientStatus, EngagementStage
from src.models.embedding import EmbeddingType
from src.services.embedding import get_embedding_service

router = APIRouter()


class CreateClientRequest(BaseModel):
    """Request to create a client."""
    company_name: str
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    headquarters: Optional[str] = None
    description: Optional[str] = None
    contacts: Optional[list[dict]] = None
    source: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    notes: Optional[str] = None


class UpdateClientRequest(BaseModel):
    """Request to update a client."""
    company_name: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    headquarters: Optional[str] = None
    description: Optional[str] = None
    contacts: Optional[list[dict]] = None
    primary_contact_name: Optional[str] = None
    primary_contact_email: Optional[str] = None
    status: Optional[str] = None
    engagement_stage: Optional[str] = None
    notes: Optional[str] = None
    tech_stack: Optional[list[str]] = None
    icp_match_score: Optional[float] = None
    icp_match_reasons: Optional[list[str]] = None


@router.post("")
async def create_client(
    request: CreateClientRequest,
    db: AsyncSession = Depends(get_db),
):
    """Create a new client/prospect."""
    client = Client(
        company_name=request.company_name,
        website=request.website,
        industry=request.industry,
        company_size=request.company_size,
        headquarters=request.headquarters,
        description=request.description,
        contacts=request.contacts,
        source=request.source,
        tech_stack=request.tech_stack or [],
        notes=request.notes,
        status=ClientStatus.PROSPECT,
        engagement_stage=EngagementStage.IDENTIFIED,
    )

    # Set primary contact from contacts list if provided
    if request.contacts and len(request.contacts) > 0:
        client.primary_contact_name = request.contacts[0].get("name")
        client.primary_contact_email = request.contacts[0].get("email")

    db.add(client)
    await db.flush()

    # Generate embedding
    embedding_service = get_embedding_service()
    embedding_text = f"{request.company_name}. {request.industry or ''}. {request.description or ''}. Tech: {', '.join(request.tech_stack or [])}"
    try:
        await embedding_service.store_embedding(
            db, EmbeddingType.CLIENT, client.id, embedding_text,
            metadata={"company": request.company_name, "industry": request.industry},
        )
    except Exception:
        pass

    return {"success": True, "client": _client_to_dict(client)}


@router.get("")
async def list_clients(
    status: Optional[str] = None,
    stage: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
):
    """List all clients, optionally filtered by status or engagement stage."""
    query = select(Client).order_by(Client.created_at.desc())

    if status:
        query = query.where(Client.status == status)
    if stage:
        query = query.where(Client.engagement_stage == stage)

    result = await db.execute(query)
    clients = result.scalars().all()

    return {"clients": [_client_to_dict(c) for c in clients]}


@router.get("/{client_id}")
async def get_client(client_id: UUID, db: AsyncSession = Depends(get_db)):
    """Get a specific client by ID."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    return {"client": _client_to_dict(client)}


@router.patch("/{client_id}")
async def update_client(
    client_id: UUID,
    request: UpdateClientRequest,
    db: AsyncSession = Depends(get_db),
):
    """Update a client."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Update fields
    update_data = request.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        if field == "status" and value:
            value = ClientStatus(value)
        elif field == "engagement_stage" and value:
            value = EngagementStage(value)
        setattr(client, field, value)

    return {"success": True, "client": _client_to_dict(client)}


@router.delete("/{client_id}")
async def delete_client(client_id: UUID, db: AsyncSession = Depends(get_db)):
    """Delete a client."""
    result = await db.execute(select(Client).where(Client.id == client_id))
    client = result.scalar_one_or_none()

    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    await db.delete(client)
    return {"success": True}


def _client_to_dict(client: Client) -> dict:
    """Convert client to dictionary."""
    return {
        "id": str(client.id),
        "company_name": client.company_name,
        "website": client.website,
        "industry": client.industry,
        "company_size": client.company_size,
        "headquarters": client.headquarters,
        "description": client.description,
        "contacts": client.contacts,
        "primary_contact_name": client.primary_contact_name,
        "primary_contact_email": client.primary_contact_email,
        "icp_match_score": client.icp_match_score,
        "icp_match_reasons": client.icp_match_reasons,
        "status": client.status.value,
        "engagement_stage": client.engagement_stage.value,
        "source": client.source,
        "notes": client.notes,
        "tech_stack": client.tech_stack,
        "hiring_signals": client.hiring_signals,
        "created_at": client.created_at.isoformat(),
    }
