"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Leaf, Loader2, Eye, EyeOff, Lock } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message === "Invalid login credentials" 
          ? "Неверный email или пароль" 
          : authError.message)
        setLoading(false)
        return
      }

      if (!authData.user) {
        setError("Ошибка авторизации")
        setLoading(false)
        return
      }

      // Check if user is admin
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authData.user.id)
        .single()

      if (profileError || profile?.role !== "admin") {
        // Sign out if not admin
        await supabase.auth.signOut()
        setError("Недостаточно прав доступа")
        setLoading(false)
        return
      }

      // Success - redirect to admin dashboard
      router.push("/admin")
      router.refresh()
    } catch (error) {
      console.error("Login error:", error)
      setError("Произошла ошибка при входе")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fafaf9] to-[#dcfce7] p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <Leaf className="w-8 h-8" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-foreground">
              Вход в админ-панель
            </CardTitle>
            <CardDescription>
              MicroGreen Shop
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@microgreen.ru"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Введите пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d]"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Вход...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Войти
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link 
              href="/" 
              className="text-[#16a34a] hover:text-[#15803d] hover:underline"
            >
              ← Вернуться на сайт
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
