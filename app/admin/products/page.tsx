"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye,
  EyeOff,
  Package
} from "lucide-react"

interface Product {
  id: number
  name: string
  price: number
  weight: string
  category: string
  isActive: boolean
  isNew?: boolean
  isBestseller?: boolean
  stock: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products")
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })
      
      if (response.ok) {
        setProducts(products.filter(p => p.id !== id))
        setDeleteConfirm(null)
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !product.isActive }),
      })
      
      if (response.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, isActive: !p.isActive } : p
        ))
      }
    } catch (error) {
      console.error("Error toggling product:", error)
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeProducts = filteredProducts.filter(p => p.isActive)
  const inactiveProducts = filteredProducts.filter(p => !p.isActive)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Товары</h2>
          <p className="text-gray-500 mt-1">
            {products.length} товаров ({activeProducts.length} активных)
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Добавить товар
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Поиск товаров..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Товар</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Цена</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Категория</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Статус</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProducts.map((product) => (
                <tr key={product.id} className={!product.isActive ? "bg-gray-50" : ""}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-[#16a34a]" />
                      </div>
                      <div>
                        <p className={`font-medium ${!product.isActive ? "text-gray-400" : "text-gray-900"}`}>
                          {product.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          {product.isNew && (
                            <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">NEW</Badge>
                          )}
                          {product.isBestseller && (
                            <Badge className="bg-orange-100 text-orange-700 border-0 text-xs">HIT</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-medium ${!product.isActive ? "text-gray-400" : "text-gray-900"}`}>
                      {product.price} ₽
                    </p>
                    <p className="text-sm text-gray-500">{product.weight}</p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline" className="capitalize">
                      {product.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {product.isActive ? (
                      <Badge className="bg-green-100 text-green-700 border-0">Активен</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 border-0">Неактивен</Badge>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleToggleActive(product)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title={product.isActive ? "Скрыть" : "Показать"}
                      >
                        {product.isActive ? (
                          <Eye className="w-4 h-4 text-gray-600" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <Link href={`/admin/products/${product.id}`}>
                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Редактировать">
                          <Edit2 className="w-4 h-4 text-blue-600" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Товары не найдены</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-2">Удалить товар?</h3>
            <p className="text-gray-500 mb-6">
              Это действие нельзя отменить. Товар будет удалён навсегда.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Отмена
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
