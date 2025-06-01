"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wrench, Clock, CheckCircle, Package, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"

interface SupportRequest {
  id: string
  device_model: string
  issue_type: string
  problem_area: string
  description: string
  status: string
  created_at: string
  user_id: string
  price?: number
  component_id?: string
  quantity?: number
  end_date?: string
}

interface Component {
  id: string
  title: string
  description: string
  price: number
  in_stock: number
}

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
}

export default function MasterPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [assignedRequests, setAssignedRequests] = useState<SupportRequest[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkMasterAccess()
    fetchData()
  }, [])

  const checkMasterAccess = async () => {
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
        if (userData.role !== "master") {
          router.push("/dashboard")
          return
        }
        setCurrentUser(userData)
      } else {
        router.push("/login")
      }
    } catch (error) {
      router.push("/login")
    }
  }

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("access_token")

      // Fetch assigned support requests
      const requestsResponse = await fetch("/api/support_request", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json()
        // Filter requests assigned to this master (in_progress status)
        setAssignedRequests(
          requestsData.filter((req: SupportRequest) => req.status === "in_progress" || req.status === "approved"),
        )
      }

      // Fetch components
      const componentsResponse = await fetch("/api/components", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (componentsResponse.ok) {
        const componentsData = await componentsResponse.json()
        setComponents(componentsData)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    router.push("/")
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      approved: { label: "Tayinlangan", variant: "default" as const },
      in_progress: { label: "Bajarilmoqda", variant: "default" as const },
      completed: { label: "Yakunlangan", variant: "default" as const },
    }

    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "secondary" as const }
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
          <div className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Master Panel</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">
              {currentUser?.first_name} {currentUser?.last_name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Chiqish
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tayinlangan Ishlar</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedRequests.filter((r) => r.status === "approved").length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bajarilayotgan</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assignedRequests.filter((r) => r.status === "in_progress").length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mavjud Qismlar</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{components.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="requests">Mening Ishlarim</TabsTrigger>
            <TabsTrigger value="components">Ehtiyot Qismlar</TabsTrigger>
          </TabsList>

          {/* Assigned Requests */}
          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-xl font-semibold">Tayinlangan Ishlar</h2>

            <div className="grid gap-4">
              {assignedRequests.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Hozircha tayinlangan ishlar yo'q</p>
                  </CardContent>
                </Card>
              ) : (
                assignedRequests.map((request) => {
                  const statusInfo = getStatusBadge(request.status)
                  return (
                    <Card key={request.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{request.device_model}</CardTitle>
                            <CardDescription>{request.problem_area}</CardDescription>
                          </div>
                          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{request.description}</p>
                        <div className="text-sm text-gray-500 mb-4">
                          Turi: {request.issue_type} | {new Date(request.created_at).toLocaleDateString()}
                        </div>

                        {request.status === "approved" && (
                          <WorkEstimateForm request={request} components={components} onWorkStarted={fetchData} />
                        )}

                        {request.status === "in_progress" && (
                          <div className="space-y-4">
                            {request.price && (
                              <div className="p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold mb-2">Ish Ma'lumotlari:</h4>
                                <p>Narx: {request.price.toLocaleString()} so'm</p>
                                <p>Miqdor: {request.quantity}</p>
                                {request.end_date && (
                                  <p>Tugash sanasi: {new Date(request.end_date).toLocaleDateString()}</p>
                                )}
                              </div>
                            )}
                            <Button onClick={() => completeWork(request.id)} className="w-full">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Ishni Yakunlash
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          {/* Components */}
          <TabsContent value="components" className="space-y-6">
            <h2 className="text-xl font-semibold">Ehtiyot Qismlar</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component) => (
                <Card key={component.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{component.title}</CardTitle>
                    <CardDescription>{component.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Narx:</span>
                        <span className="font-semibold text-green-600">{component.price.toLocaleString()} so'm</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Zaxirada:</span>
                        <span className={`font-semibold ${component.in_stock > 0 ? "text-green-600" : "text-red-600"}`}>
                          {component.in_stock}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )

  async function completeWork(requestId: string) {
    try {
      const response = await fetch(`/api/support_request/status/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify("completed"),
      })

      if (response.ok) {
        fetchData() // Refresh data
      }
    } catch (error) {
      console.error("Error completing work:", error)
    }
  }
}

// Work Estimate Form Component
function WorkEstimateForm({
  request,
  components,
  onWorkStarted,
}: {
  request: SupportRequest
  components: Component[]
  onWorkStarted: () => void
}) {
  const [formData, setFormData] = useState({
    component_id: "",
    quantity: 1,
    price: 0,
    end_date: "",
  })
  const [loading, setLoading] = useState(false)

  const selectedComponent = components.find((c) => c.id === formData.component_id)

  useEffect(() => {
    if (selectedComponent) {
      setFormData((prev) => ({
        ...prev,
        price: selectedComponent.price * prev.quantity,
      }))
    }
  }, [selectedComponent, formData.quantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/support_request/master/${request.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          end_date: new Date(formData.end_date).toISOString(),
        }),
      })

      if (response.ok) {
        onWorkStarted()
      }
    } catch (error) {
      console.error("Error starting work:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-t pt-4">
      <h4 className="font-semibold mb-4">Ish Baholash va Boshlash</h4>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="component">Kerakli Qism</Label>
          <Select
            value={formData.component_id}
            onValueChange={(value) => setFormData({ ...formData, component_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Qismni tanlang" />
            </SelectTrigger>
            <SelectContent>
              {components.map((component) => (
                <SelectItem key={component.id} value={component.id}>
                  {component.title} - {component.price.toLocaleString()} so'm
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity">Miqdor</Label>
          <Input
            id="quantity"
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">Tugash Sanasi</Label>
          <Input
            id="end_date"
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            required
          />
        </div>

        {selectedComponent && (
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Jami Narx:</span>
              <span className="text-lg font-bold text-green-600">{formData.price.toLocaleString()} so'm</span>
            </div>
          </div>
        )}

        <Button type="submit" disabled={loading || !formData.component_id} className="w-full">
          {loading ? "Boshlanmoqda..." : "Ishni Boshlash"}
        </Button>
      </form>
    </div>
  )
}
