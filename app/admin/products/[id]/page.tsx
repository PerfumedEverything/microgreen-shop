"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Package, Trash2 } from "lucide-react"

const categories = [
  { value: "vegetables", label: "Овощи" },
  { value: "herbs", label: "Зелень" },
  { value: "legumes", label: "Бобовые" },
  { value: "seeds", label: "Семена" },
]

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch("/api/products")
      const products = await response.json()
      const found = products.find((p: any) => p.id === parseInt(params.id))
      if (found) {
        setProduct(found)
      }
    } catch (error) {
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })

      if (response.ok) {
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error updating product:", error)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Вы уверены, что хотите удалить этот товар?")) return

    try {
      const response = await fetch(`/api/products/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#16a34a] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Товар не найден</p>
        <Link href="/admin/products">
          <Button className="mt-4">Вернуться к списку</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Редактировать товар</h2>
            <p className="text-gray-500">{product.name}</p>
          </div>
        </div>
        <Button 
          variant="destructive" 
          onClick={handleDelete}
          className="gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Удалить
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="bg-white rounded-xl border border-border p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Package className="w-5 h-5 text-[#16a34a]" />
              Основная информация
            </h3>
            
            <div>
              <Label htmlFor="name">Название товара *</Label>
              <Input
                id="name"
                value={product.name}
                onChange={(e) => setProduct({ ...product, name: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          {/* Price & Weight */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Цена (₽) *</Label>
              <Input
                id="price"
                type="number"
                value={product.price}
                onChange={(e) => setProduct({ ...product, price: parseInt(e.target.value) })}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight">Вес</Label>
              <Input
                id="weight"
                value={product.weight}
                onChange={(e) => setProduct({ ...product, weight: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Category & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Категория</Label>
              <select
                id="category"
                value={product.category}
                onChange={(e) => setProduct({ ...product, category: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-[#16a34a]"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="stock">Остаток на складе</Label>
              <Input
                id="stock"
                type="number"
                value={product.stock}
                onChange={(e) => setProduct({ ...product, stock: parseInt(e.target.value) })}
                className="mt-1"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">URL изображения</Label>
            <Input
              id="image"
              value={product.image}
              onChange={(e) => setProduct({ ...product, image: e.target.value })}
              className="mt-1"
            />
          </div>

          {/* Preview */}
          {product.image && (
            <div>
              <Label>Превью</Label>
              <div className="mt-2 relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Options */}
          <div className="flex gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={product.isNew}
                onCheckedChange={(checked) => 
                  setProduct({ ...product, isNew: checked as boolean })
                }
              />
              <span>Новинка</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={product.isBestseller}
                onCheckedChange={(checked) => 
                  setProduct({ ...product, isBestseller: checked as boolean })
                }
              />
              <span>Хит продаж</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={product.isActive}
                onCheckedChange={(checked) => 
                  setProduct({ ...product, isActive: checked as boolean })
                }
              />
              <span>Активен</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link href="/admin/products" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Отмена
              </Button>
            </Link>
            <Button 
              type="submit" 
              className="flex-1 bg-[#16a34a] hover:bg-[#15803d] text-white"
              disabled={saving}
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Сохранить изменения
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
