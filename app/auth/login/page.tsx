import { AuthForm } from "@/components/auth-form"
import { Zap } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40">
      <div className="mb-8 flex items-center space-x-2">
        <Zap className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">AI Prospector</h1>
      </div>
      <AuthForm />
    </div>
  )
}
