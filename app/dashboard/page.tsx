"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, CheckCircle, AlertCircle, LogOut, Home, Plus, MessageSquare, DollarSign } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface SupportRequest {
  id: string
  device_model: string
  issue_type: string
  problem_area: string
  description: string
  status: string
  created_at: string
  price?: number
  estimated_price?: number
  estimated_end_date?: string
  component_id?: string
  quantity?: number
}

interface UserProfile {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchUserData()
    fetchRequests()
  }, [])

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch("/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      router.push("/login")
    }
  }

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("/api/support_request", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      console.error("Error fetching requests:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/")
  }

  const approveEstimate = async (requestId: string, approved: boolean) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/support_request/approve/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ approved }),
      })

      if (response.ok) {
        fetchRequests() // Refresh requests
      }
    } catch (error) {
      console.error("Error approving estimate:", error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Kutilmoqda", variant: "secondary" as const },
      checked: { label: "Ko'rib chiqilmoqda", variant: "default" as const },
      approved: { label: "Tasdiqlangan", variant: "default" as const },
      awaiting_approval: { label: "Tasdiqlash kutilmoqda", variant: "default" as const },
      in_progress: { label: "Bajarilmoqda", variant: "default" as const },
      rejected: { label: "Rad etilgan", variant: "destructive" as const },
      completed: { label: "Yakunlangan", variant: "default" as const },
    }

    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      case "awaiting_approval":
        return <DollarSign className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-5 w-5 text-blue-600" />
              <span className="text-blue-600 font-medium">Bosh sahifa</span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Shaxsiy Kabinet</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              Salom, {user?.first_name} {user?.last_name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="requests">So'rovlar</TabsTrigger>
            <TabsTrigger value="new-request">Yangi So'rov</TabsTrigger>
            <TabsTrigger value="profile">Profil</TabsTrigger>
          </TabsList>

          {/* Support Requests Tab */}
          <TabsContent value="requests" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mening So'rovlarim</h2>
            </div>

            <div className="grid gap-4">
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-2">Hozircha so'rovlaringiz yo'q</p>
                    <p className="text-gray-500 mb-4">Yangi so'rov yaratish uchun "Yangi So'rov" bo'limiga o'ting</p>
                    <Button asChild>
                      <Link href="/dashboard?tab=new-request">
                        <Plus className="h-4 w-4 mr-2" />
                        Yangi So'rov Yaratish
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                requests.map((request) => {
                  const statusInfo = getStatusBadge(request.status)
                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{request.device_model}</CardTitle>
                            <CardDescription>{request.problem_area}</CardDescription>
                          </div>
                          <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {statusInfo.label}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{request.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Muammo turi: {request.issue_type}</span>
                          <span>{new Date(request.created_at).toLocaleDateString()}</span>
                        </div>

                        {/* Show estimate for approval */}
                        {request.status === "awaiting_approval" && request.estimated_price && (
                          <div className="border-t pt-4">
                            <h4 className="font-semibold mb-2">Master Taklifi:</h4>
                            <div className="bg-blue-50 p-4 rounded-lg mb-4">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span>Taxminiy narx:</span>
                                  <span className="font-semibold text-green-600">
                                    {request.estimated_price.toLocaleString()} so'm
                                  </span>
                                </div>
                                {request.quantity && (
                                  <div className="flex justify-between">
                                    <span>Miqdor:</span>
                                    <span>{request.quantity}</span>
                                  </div>
                                )}
                                {request.estimated_end_date && (
                                  <div className="flex justify-between">
                                    <span>Tugash sanasi:</span>
                                    <span>{new Date(request.estimated_end_date).toLocaleDateString()}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button onClick={() => approveEstimate(request.id, true)} className="flex-1">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Tasdiqlash
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => approveEstimate(request.id, false)}
                                className="flex-1"
                              >
                                <AlertCircle className="h-4 w-4 mr-2" />
                                Rad etish
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Show final price for completed requests */}
                        {request.price && request.status === "completed" && (
                          <div className="mt-2 text-lg font-semibold text-green-600">
                            Yakuniy narx: {request.price.toLocaleString()} so'm
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* New Request Tab */}
          <TabsContent value="new-request">
            <NewRequestForm onRequestCreated={fetchRequests} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileSettings user={user} onUserUpdated={setUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// New Request Form Component
function NewRequestForm({ onRequestCreated }: { onRequestCreated: () => void }) {
  const [formData, setFormData] = useState({
    device_model: "",
    issue_type: "",
    problem_area: "",
    description: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("/api/support_request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setSuccess(true)
        setFormData({
          device_model: "",
          issue_type: "",
          problem_area: "",
          description: "",
          location: "",
        })
        onRequestCreated()
      }
    } catch (error) {
      console.error("Error creating request:", error)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">So'rov muvaffaqiyatli yuborildi!</h3>
          <p className="text-gray-600 mb-4">Tez orada mutaxassislarimiz siz bilan bog'lanadi.</p>
          <Button onClick={() => setSuccess(false)}>Yangi so'rov yaratish</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Yangi Qo'llab-quvvatlash So'rovi
        </CardTitle>
        <CardDescription>Muammo haqida batafsil ma'lumot bering</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="device_model">Qurilma modeli</Label>
            <Input
              id="device_model"
              type="text"
              placeholder="Masalan: Dell Inspiron 15, iPhone 12, Samsung Galaxy S21"
              value={formData.device_model}
              onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issue_type">Muammo turi</Label>
            <Select
              value={formData.issue_type}
              onValueChange={(value) => setFormData({ ...formData, issue_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Muammo turini tanlang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hardware">Hardware (Apparat muammolari)</SelectItem>
                <SelectItem value="software">Software (Dastur muammolari)</SelectItem>
                <SelectItem value="network">Network (Tarmoq muammolari)</SelectItem>
                <SelectItem value="other">Boshqa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="problem_area">Muammo sohasi</Label>
            <Input
              id="problem_area"
              type="text"
              placeholder="Masalan: Ekran, Klaviatura, Internet, Virus, Sekinlik"
              value={formData.problem_area}
              onChange={(e) => setFormData({ ...formData, problem_area: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Muammo tavsifi</Label>
            <Textarea
              id="description"
              placeholder="Muammoni batafsil tasvirlab bering. Qachon boshlangan, qanday holatda yuz beradi, qanday xato xabarlari chiqadi va hokazo..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="min-h-[100px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Joylashuv</Label>
            <Input
              id="location"
              type="text"
              placeholder="Manzil yoki joylashuv (uyga chiqib xizmat uchun)"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Eslatma:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• So'rovingiz 24 soat ichida ko'rib chiqiladi</li>
              <li>• Shoshilinch holatlar uchun: +998 90 999 99 99</li>
              <li>• Narx muammoning murakkabligiga qarab belgilanadi</li>
              <li>• Barcha ishlar uchun kafolat beriladi</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Yuborilmoqda..." : "So'rov yuborish"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

// Profile Settings Component
function ProfileSettings({
  user,
  onUserUpdated,
}: { user: UserProfile | null; onUserUpdated: (user: UserProfile) => void }) {
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        onUserUpdated(updatedUser)
      }
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil Sozlamalari</CardTitle>
        <CardDescription>Shaxsiy ma'lumotlaringizni yangilang</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">Ism</Label>
              <Input
                id="first_name"
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Familiya</Label>
              <Input
                id="last_name"
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
