"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, Eye, EyeOff, Database } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  const isDevelopment = process.env.NODE_ENV === "development"

  const handleSeed = async () => {
    setSeeding(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/seed")
      const data = await response.json()

      if (response.ok) {
        setSuccess("Database muvaffaqiyatli to'ldirildi!")
        console.log("Seed successful:", data)
      } else {
        setError(data.detail || "Seed failed")
      }
    } catch (err) {
      console.error("Seed error:", err)
      setError("Seed jarayonida xatolik yuz berdi")
    } finally {
      setSeeding(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.detail || "Login muvaffaqiyatsiz")
        return
      }

      const data = await response.json()

      if (data.access_token) {
        localStorage.setItem("access_token", data.access_token)

        // Redirect based on role
        switch (data.role) {
          case "manager":
            router.push("/admin")
            break
          case "master":
            router.push("/master")
            break
          default:
            router.push("/dashboard")
        }
      } else {
        setError("Token olinmadi")
      }
    } catch (err) {
      console.error("Network error:", err)
      setError("Tarmoq xatosi yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span>DernSupport</span>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tizimga kirish</CardTitle>
            <CardDescription>Hisobingizga kirish uchun ma'lumotlaringizni kiriting</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Development only features */}
            {isDevelopment && (
              <>
                <div className="mb-4">
                  <Button onClick={handleSeed} disabled={seeding} variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    {seeding ? "Database to'ldirilmoqda..." : "Database ni to'ldirish"}
                  </Button>
                </div>

                <div className="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="font-semibold text-blue-800 mb-2">Test uchun:</p>
                  <p className="text-blue-700">Admin: admin@dernsupport.uz / password123</p>
                  <p className="text-blue-700">Master: master@dernsupport.uz / password123</p>
                  <p className="text-blue-700">User: user@dernsupport.uz / password123</p>
                </div>
              </>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Parol</Label>
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                    Parolni unutdingizmi?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Parolingizni kiriting"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Kuting..." : "Kirish"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Hisobingiz yo'qmi?{" "}
                <Link href="/register" className="text-blue-600 hover:underline font-medium">
                  Ro'yxatdan o'ting
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
