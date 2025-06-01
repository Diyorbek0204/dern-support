"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wrench, CheckCircle, Copy } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [users, setUsers] = useState<any[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  // Check if setup is already done
  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch("/api/check-setup")
        const data = await response.json()

        if (data.setupDone) {
          setSuccess(true)
          setUsers(data.users || [])
        }
      } catch (err) {
        // Ignore errors, will just show setup button
      }
    }

    checkSetup()
  }, [])

  const handleSetup = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/create_default_users", {
        method: "POST",
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        if (data.users) {
          setUsers(data.users)
        }
      } else {
        setError(data.detail || "Setup failed")
      }
    } catch (err) {
      setError("Network error occurred")
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, userId: string) => {
    navigator.clipboard.writeText(text)
    setCopied(userId)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span>DernSupport</span>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Tizimni Sozlash</CardTitle>
            <CardDescription>
              Boshlang'ich foydalanuvchilar va ma'lumotlarni yaratish uchun "Sozlash" tugmasini bosing
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success ? (
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Sozlash muvaffaqiyatli yakunlandi!</h3>
                <p className="text-gray-600 mb-6">Quyidagi foydalanuvchilar yaratildi:</p>

                <div className="space-y-3 mb-6">
                  {users.map((user, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md text-left">
                      <div className="font-semibold">
                        {user.role === "manager" ? "Admin" : user.role === "master" ? "Master" : "Foydalanuvchi"}
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Email: {user.email}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(user.email, `${user.role}-email`)}
                          className="h-6 w-6 p-0"
                        >
                          {copied === `${user.role}-email` ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">Parol: {user.password}</div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(user.password, `${user.role}-password`)}
                          className="h-6 w-6 p-0"
                        >
                          {copied === `${user.role}-password` ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link href="/login">Kirish sahifasiga o'tish</Link>
                </Button>
              </div>
            ) : (
              <Button onClick={handleSetup} className="w-full" disabled={loading}>
                {loading ? "Sozlanmoqda..." : "Sozlash"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
