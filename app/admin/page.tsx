"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Package,
  ClipboardList,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  LogOut,
  BarChart3,
  PieChartIcon,
  TrendingUp,
  UserCheck,
  UserX,
  Bell,
  MessageSquare,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"

interface User {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  role: string
  person_type: string
  company_name?: string
}

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
  assigned_master_id?: string
  location?: string
}

interface Component {
  id: string
  title: string
  description: string
  price: number
  in_stock: number
}

interface Analytics {
  totalRequests: number
  completedRequests: number
  pendingRequests: number
  inProgressRequests: number
  rejectedRequests: number
  issueTypes: {
    hardware: number
    software: number
    network: number
    other: number
  }
  monthlyData: Array<{
    date: string
    requests: number
    completed: number
  }>
  locationData: Array<{
    city: string
    count: number
  }>
  totalUsers: number
  totalMasters: number
  totalRevenue: number
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [components, setComponents] = useState<Component[]>([])
  const [masters, setMasters] = useState<User[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
    fetchData()
  }, [])

  const checkAdminAccess = async () => {
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
        if (userData.role !== "manager") {
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

      // Fetch all data in parallel
      const [usersRes, requestsRes, componentsRes, analyticsRes] = await Promise.all([
        fetch("/api/users", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/support_request", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/components", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/analytics", { headers: { Authorization: `Bearer ${token}` } }),
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
        setMasters(usersData.filter((user: User) => user.role === "master"))
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json()
        setRequests(requestsData)
      }

      if (componentsRes.ok) {
        const componentsData = await componentsRes.json()
        setComponents(componentsData)
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
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

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      const response = await fetch(`/api/support_request/status/${requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(status),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error updating status:", error)
    }
  }

  const assignMasterToRequest = async (requestId: string, masterId: string) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/support_request/assign_master/${requestId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ master_id: masterId }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error assigning master:", error)
    }
  }

  const changeUserRole = async (userId: string, newRole: string) => {
    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error changing user role:", error)
    }
  }

  const deleteUser = async (userId: string) => {
    if (!confirm("Bu foydalanuvchini o'chirishni xohlaysizmi?")) return

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        fetchData()
      }
    } catch (error) {
      console.error("Error deleting user:", error)
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {requests.filter((r) => r.status === "pending").length}
              </span>
            </div>
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
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jami Foydalanuvchilar</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
              <p className="text-xs text-muted-foreground">
                {masters.length} master, {users.filter((u) => u.role === "user").length} foydalanuvchi
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Faol So'rovlar</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {requests.filter((r) => !["completed", "rejected"].includes(r.status)).length}
              </div>
              <p className="text-xs text-muted-foreground">
                {requests.filter((r) => r.status === "pending").length} kutilmoqda
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Yakunlangan</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analytics?.completedRequests || 0}</div>
              <p className="text-xs text-muted-foreground">
                {analytics?.totalRequests > 0
                  ? Math.round(((analytics?.completedRequests || 0) / analytics.totalRequests) * 100)
                  : 0}
                % muvaffaqiyat
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Daromad</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(analytics?.totalRevenue || 0).toLocaleString()} so'm</div>
              <p className="text-xs text-muted-foreground">Jami daromad</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="requests">So'rovlar</TabsTrigger>
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="components">Ehtiyot Qismlar</TabsTrigger>
            <TabsTrigger value="analytics">Tahlil</TabsTrigger>
            <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
          </TabsList>

          {/* Support Requests Management */}
          <TabsContent value="requests" className="space-y-6">
            <RequestsManagement
              requests={requests}
              masters={masters}
              onStatusUpdate={updateRequestStatus}
              onMasterAssign={assignMasterToRequest}
            />
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users" className="space-y-6">
            <UsersManagement
              users={users}
              onRoleChange={changeUserRole}
              onUserDelete={deleteUser}
              onUsersUpdated={fetchData}
            />
          </TabsContent>

          {/* Components Management */}
          <TabsContent value="components" className="space-y-6">
            <ComponentsManagement components={components} onComponentsUpdated={fetchData} />
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsDashboard analytics={analytics} />
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="space-y-6">
            <NotificationsPanel requests={requests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// Requests Management Component
function RequestsManagement({
  requests,
  masters,
  onStatusUpdate,
  onMasterAssign,
}: {
  requests: SupportRequest[]
  masters: User[]
  onStatusUpdate: (requestId: string, status: string) => void
  onMasterAssign: (requestId: string, masterId: string) => void
}) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Qo'llab-quvvatlash So'rovlari</h2>
      </div>

      <div className="grid gap-4">
        {requests.map((request) => {
          const statusInfo = getStatusBadge(request.status)
          const assignedMaster = masters.find((m) => m.id === request.assigned_master_id)

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
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Turi: {request.issue_type} | {new Date(request.created_at).toLocaleDateString()}
                    {request.location && ` | ${request.location}`}
                  </span>
                  {assignedMaster && (
                    <span className="text-sm text-blue-600">
                      Master: {assignedMaster.first_name} {assignedMaster.last_name}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {request.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => onStatusUpdate(request.id, "approved")}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Tasdiqlash
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onStatusUpdate(request.id, "rejected")}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Rad etish
                      </Button>
                    </>
                  )}

                  {request.status === "approved" && !request.assigned_master_id && (
                    <div className="flex items-center space-x-2">
                      <Select onValueChange={(masterId) => onMasterAssign(request.id, masterId)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Master tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          {masters.map((master) => (
                            <SelectItem key={master.id} value={master.id}>
                              {master.first_name} {master.last_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// Users Management Component
function UsersManagement({
  users,
  onRoleChange,
  onUserDelete,
  onUsersUpdated,
}: {
  users: User[]
  onRoleChange: (userId: string, newRole: string) => void
  onUserDelete: (userId: string) => void
  onUsersUpdated: () => void
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    role: "user",
    person_type: "individual",
    company_name: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("access_token")
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      const method = editingUser ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowAddForm(false)
        setEditingUser(null)
        setFormData({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "user",
          person_type: "individual",
          company_name: "",
        })
        onUsersUpdated()
      }
    } catch (error) {
      console.error("Error saving user:", error)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      person_type: user.person_type,
      company_name: user.company_name || "",
    })
    setShowAddForm(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Foydalanuvchilar</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yangi Foydalanuvchi
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingUser ? "Foydalanuvchini Tahrirlash" : "Yangi Foydalanuvchi Qo'shish"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">Ism</Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Familiya</Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
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
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Foydalanuvchi</SelectItem>
                      <SelectItem value="master">Master</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">{editingUser ? "Yangilash" : "Qo'shish"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingUser(null)
                    setFormData({
                      first_name: "",
                      last_name: "",
                      email: "",
                      phone: "",
                      role: "user",
                      person_type: "individual",
                      company_name: "",
                    })
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                  <Badge variant="outline" className="mt-2">
                    {user.role === "manager" ? "Admin" : user.role === "master" ? "Master" : "Foydalanuvchi"}
                  </Badge>
                </div>
                <div className="flex space-x-2">
                  {user.role === "user" && (
                    <Button size="sm" variant="outline" onClick={() => onRoleChange(user.id, "master")}>
                      <UserCheck className="h-4 w-4 mr-1" />
                      Master qilish
                    </Button>
                  )}
                  {user.role === "master" && (
                    <Button size="sm" variant="outline" onClick={() => onRoleChange(user.id, "user")}>
                      <UserX className="h-4 w-4 mr-1" />
                      Foydalanuvchi qilish
                    </Button>
                  )}
                  <Button size="sm" variant="outline" onClick={() => handleEdit(user)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onUserDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Components Management Component
function ComponentsManagement({
  components,
  onComponentsUpdated,
}: {
  components: Component[]
  onComponentsUpdated: () => void
}) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingComponent, setEditingComponent] = useState<Component | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    in_stock: 0,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem("access_token")
      const url = editingComponent ? `/api/components/${editingComponent.id}` : "/api/components"
      const method = editingComponent ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowAddForm(false)
        setEditingComponent(null)
        setFormData({ title: "", description: "", price: 0, in_stock: 0 })
        onComponentsUpdated()
      }
    } catch (error) {
      console.error("Error saving component:", error)
    }
  }

  const handleEdit = (component: Component) => {
    setEditingComponent(component)
    setFormData({
      title: component.title,
      description: component.description,
      price: component.price,
      in_stock: component.in_stock,
    })
    setShowAddForm(true)
  }

  const handleDelete = async (componentId: string) => {
    if (!confirm("Bu komponentni o'chirishni xohlaysizmi?")) return

    try {
      const token = localStorage.getItem("access_token")
      const response = await fetch(`/api/components/${componentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        onComponentsUpdated()
      }
    } catch (error) {
      console.error("Error deleting component:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Ehtiyot Qismlar</h2>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Yangi Qism Qo'shish
        </Button>
      </div>

      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingComponent ? "Komponentni Tahrirlash" : "Yangi Komponent Qo'shish"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nomi</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Tavsif</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Narx (so'm)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="in_stock">Zaxirada</Label>
                  <Input
                    id="in_stock"
                    type="number"
                    value={formData.in_stock}
                    onChange={(e) => setFormData({ ...formData, in_stock: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-2">
                <Button type="submit">{editingComponent ? "Yangilash" : "Qo'shish"}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingComponent(null)
                    setFormData({ title: "", description: "", price: 0, in_stock: 0 })
                  }}
                >
                  Bekor qilish
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {components.map((component) => (
          <Card key={component.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{component.title}</h3>
                  <p className="text-gray-600">{component.description}</p>
                  <div className="flex space-x-4 mt-2">
                    <span className="text-lg font-semibold text-green-600">
                      {component.price.toLocaleString()} so'm
                    </span>
                    <span className={`text-sm ${component.in_stock > 0 ? "text-green-600" : "text-red-600"}`}>
                      Zaxirada: {component.in_stock}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(component)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(component.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Analytics Dashboard Component
function AnalyticsDashboard({ analytics }: { analytics: Analytics | null }) {
  if (!analytics) return <div>Ma'lumotlar yuklanmoqda...</div>

  const issueTypeData = [
    { name: "Hardware", value: analytics.issueTypes.hardware, color: "#0088FE" },
    { name: "Software", value: analytics.issueTypes.software, color: "#00C49F" },
    { name: "Network", value: analytics.issueTypes.network, color: "#FFBB28" },
    { name: "Boshqa", value: analytics.issueTypes.other, color: "#FF8042" },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Statistika va Tahlil</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Requests Chart */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Oylik So'rovlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="requests" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Types Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChartIcon className="h-5 w-5 mr-2" />
              Muammo Turlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={issueTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {issueTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Location Data */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Joylashuv bo'yicha So'rovlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.locationData.map((location, index) => (
                <div key={location.city} className="flex justify-between items-center">
                  <span>{location.city}</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-4 rounded"
                      style={{
                        width: `${(location.count / Math.max(...analytics.locationData.map((l) => l.count))) * 100}px`,
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    ></div>
                    <span className="font-semibold">{location.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Muvaffaqiyat Darajasi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {analytics.totalRequests > 0
                  ? Math.round((analytics.completedRequests / analytics.totalRequests) * 100)
                  : 0}
                %
              </div>
              <p className="text-gray-600">Yakunlangan so'rovlar</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Yakunlangan:</span>
                  <span>{analytics.completedRequests}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Jami:</span>
                  <span>{analytics.totalRequests}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Foydalanuvchilar Statistikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Jami foydalanuvchilar:</span>
                <span className="font-semibold">{analytics.totalUsers + analytics.totalMasters}</span>
              </div>
              <div className="flex justify-between">
                <span>Oddiy foydalanuvchilar:</span>
                <span className="font-semibold">{analytics.totalUsers}</span>
              </div>
              <div className="flex justify-between">
                <span>Masterlar:</span>
                <span className="font-semibold">{analytics.totalMasters}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Moliyaviy Hisobot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Jami daromad:</span>
                <span className="font-semibold text-green-600">{analytics.totalRevenue.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between">
                <span>O'rtacha ish narxi:</span>
                <span className="font-semibold">
                  {analytics.completedRequests > 0
                    ? Math.round(analytics.totalRevenue / analytics.completedRequests).toLocaleString()
                    : 0}{" "}
                  so'm
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Notifications Panel Component
function NotificationsPanel({ requests }: { requests: SupportRequest[] }) {
  const pendingRequests = requests.filter((r) => r.status === "pending")
  const awaitingApproval = requests.filter((r) => r.status === "awaiting_approval")
  const urgentRequests = requests.filter(
    (r) => r.status === "pending" && new Date().getTime() - new Date(r.created_at).getTime() > 24 * 60 * 60 * 1000,
  )

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center">
        <Bell className="h-5 w-5 mr-2" />
        Bildirishnomalar
      </h2>

      <div className="grid gap-4">
        {urgentRequests.length > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-800">Shoshilinch So'rovlar</CardTitle>
              <CardDescription className="text-red-600">24 soatdan ortiq kutayotgan so'rovlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {urgentRequests.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 bg-white rounded">
                    <span>
                      {request.device_model} - {request.problem_area}
                    </span>
                    <span className="text-sm text-gray-500">
                      {Math.round((new Date().getTime() - new Date(request.created_at).getTime()) / (1000 * 60 * 60))}{" "}
                      soat oldin
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {awaitingApproval.length > 0 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800">Tasdiqlash Kutilmoqda</CardTitle>
              <CardDescription className="text-yellow-600">
                Foydalanuvchi tasdiqini kutayotgan so'rovlar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {awaitingApproval.map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 bg-white rounded">
                    <span>
                      {request.device_model} - {request.problem_area}
                    </span>
                    <span className="text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Yangi So'rovlar
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <p className="text-gray-500">Yangi so'rovlar yo'q</p>
            ) : (
              <div className="space-y-2">
                {pendingRequests.slice(0, 5).map((request) => (
                  <div key={request.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <span className="font-medium">{request.device_model}</span>
                      <p className="text-sm text-gray-600">{request.problem_area}</p>
                    </div>
                    <span className="text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</span>
                  </div>
                ))}
                {pendingRequests.length > 5 && (
                  <p className="text-sm text-gray-500 text-center">va yana {pendingRequests.length - 5} ta so'rov...</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
