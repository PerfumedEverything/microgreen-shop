"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Package } from "lucide-react"

const categories = [
  { value: "vegetables", label: "Овощи" },
  { value: "herbs", label: "Зелень" },
  { value: "legumes", label: "Бобовые" },
  { value: "seeds", label: "Семена" },
]

export default function NewProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    weight: "50 г",
    description: "",
    image: "",
    category: "vegetables",
    stock: "50",
    isNew: false,
    isBestseller: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
        }),
      })

      if (response.ok) {
        router.push("/admin/products")
      }
    } catch (error) {
      console.error("Error creating product:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Новый товар</h2>
          <p className="text-gray-500">Добавьте новый товар в каталог</p>
        </div>
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
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Микрозелень гороха"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Описание товара..."
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
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="350"
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="weight">Вес</Label>
              <Input
                id="weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="50 г"
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
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                className="mt-1"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image">URL изображения</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Вставьте ссылку на изображение или загрузите в разделе Медиа
            </p>
          </div>

          {/* Options */}
          <div className="flex gap-6 pt-4 border-t border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.isNew}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isNew: checked as boolean })
                }
              />
              <span>Новинка</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={formData.isBestseller}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, isBestseller: checked as boolean })
                }
              />
              <span>Хит продаж</span>
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
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Сохранение...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Создать товар
                </span>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
