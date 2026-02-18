"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  ShoppingCart, 
  Plus,
  Settings,
  FileText,
  Image as ImageIcon,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { useCartStore } from "@/app/stores/cartStore"

interface Product {
  id: number
  name: string
  price: number
  stock: number
  isActive: boolean
  isNew?: boolean
  isBestseller?: boolean
}

export default function AdminDashboardPage() {
  const { items: cartItems, getTotalPrice } = useCartStore()
  const [mounted, setMounted] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    lowStock: 0,
  })

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
      setStats({
        totalProducts: data.length,
        activeProducts: data.filter((p: Product) => p.isActive).length,
        lowStock: data.filter((p: Product) => p.stock < 20).length,
      })
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const quickActions = [
    {
      title: "Добавить товар",
      description: "Создать новую позицию",
      icon: Plus,
      href: "/admin/products/new",
      color: "bg-[#16a34a]",
    },
    {
      title: "Редактировать контент",
      description: "Тексты и контакты",
      icon: FileText,
      href: "/admin/content",
      color: "bg-blue-500",
    },
    {
      title: "Загрузить медиа",
      description: "Изображения",
      icon: ImageIcon,
      href: "/admin/media",
      color: "bg-purple-500",
    },
    {
      title: "Настройки",
      description: "Доставка и оплата",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Панель управления</h1>
          <p className="text-slate-500 mt-1">
            Управляйте товарами, контентом и настройками магазина
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" target="_blank">
            <Button variant="outline">Просмотр сайта</Button>
          </Link>
          <Link href="/admin/products/new">
            <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white gap-2">
              <Plus className="w-4 h-4" />
              Новый товар
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-[#16a34a]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-[#dcfce7] rounded-xl">
                <Package className="w-6 h-6 text-[#16a34a]" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                {stats.activeProducts} активных
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stats.totalProducts}</p>
              <p className="text-sm text-slate-500">Всего товаров</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-orange-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
              {stats.lowStock > 0 && (
                <Badge variant="destructive">{stats.lowStock} товаров</Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">{stats.lowStock}</p>
              <p className="text-sm text-slate-500">Мало на складе</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="p-3 bg-purple-100 rounded-xl">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-slate-900">
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </p>
              <p className="text-sm text-slate-500">В корзинах</p>
              <p className="text-lg font-semibold text-[#16a34a] mt-1">
                {getTotalPrice()} ₽
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.href} href={action.href}>
                    <div className="group p-4 rounded-xl border border-slate-200 hover:border-[#16a34a] hover:shadow-lg transition-all cursor-pointer bg-white">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${action.color} text-white`}>
                          <action.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 group-hover:text-[#16a34a]">
                            {action.title}
                          </h3>
                          <p className="text-sm text-slate-500 mt-1">
                            {action.description}
                          </p>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-slate-400 group-hover:text-[#16a34a]" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Products Preview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Товары</CardTitle>
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Все товары
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {products.slice(0, 5).map((product) => (
                  <div 
                    key={product.id} 
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-sm text-slate-500">{product.price} ₽ • {product.stock} шт</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.stock < 20 && (
                        <Badge variant="destructive" className="text-xs">Мало</Badge>
                      )}
                      <Badge variant={product.isActive ? "default" : "secondary"} className={product.isActive ? "bg-[#16a34a]" : ""}>
                        {product.isActive ? "Активен" : "Скрыт"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Статус системы
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">API</span>
                <Badge className="bg-green-100 text-green-700">Работает</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">База данных</span>
                <Badge className="bg-green-100 text-green-700">Подключена</Badge>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-slate-600">Корзина</span>
                <Badge className="bg-green-100 text-green-700">Активна</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Cart Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Корзина пользователей</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.length > 0 ? (
                <div className="space-y-3">
                  <div className="p-4 bg-[#dcfce7] rounded-xl">
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Товаров</span>
                      <span className="font-bold text-[#16a34a]">
                        {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Сумма</span>
                      <span className="font-bold text-[#16a34a]">{getTotalPrice()} ₽</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-slate-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Корзина пуста</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
