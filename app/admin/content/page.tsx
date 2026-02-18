"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Save, Globe, Home, ShoppingBag, Truck, Info, Phone } from "lucide-react"

// Дефолтный контент
const defaultContent = {
  hero: {
    title: "Свежая микрозелень",
    subtitle: "у вас дома за 2 часа",
    description: "Выращиваем с любовью, доставляем с заботой. Органические микрозелень и съедобные цветы для ваших блюд.",
  },
  seo: {
    title: "MicroGreen Shop - Свежая микрозелень в Москве",
    description: "Доставка свежей микрозелени по Москве и области. Более 12 видов. Закажите онлайн!",
    keywords: "микрозелень, доставка, москва, здоровое питание",
  },
  about: {
    title: "О нас",
    text: "MicroGreen — это команда энтузиастов, которые любят свою работу и верят в силу натуральных продуктов.",
  },
  delivery: {
    title: "Доставка",
    text: "Быстрая доставка свежей микрозелени по Москве и Московской области.",
  },
}

export default function ContentPage() {
  const [content, setContent] = useState(defaultContent)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Загрузка из localStorage
    const saved = localStorage.getItem("site-content")
    if (saved) {
      setContent(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setSaving(true)
    
    // Сохраняем в localStorage (в проде это будет API)
    localStorage.setItem("site-content", JSON.stringify(content))
    
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Контент сайта</h2>
          <p className="text-gray-500 mt-1">Редактируйте тексты и SEO-настройки</p>
        </div>
        <Button 
          onClick={handleSave}
          className="bg-[#16a34a] hover:bg-[#15803d] text-white"
          disabled={saving}
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Сохранение...
            </span>
          ) : saved ? (
            <span className="flex items-center gap-2">
              ✓ Сохранено
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Сохранить
            </span>
          )}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="hero" className="gap-2">
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Главная</span>
          </TabsTrigger>
          <TabsTrigger value="seo" className="gap-2">
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="about" className="gap-2">
            <Info className="w-4 h-4" />
            <span className="hidden sm:inline">О нас</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Доставка</span>
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5 text-[#16a34a]" />
                Главная секция (Hero)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок (часть 1)</Label>
                <Input
                  value={content.hero.title}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, title: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Заголовок (часть 2 - зелёная)</Label>
                <Input
                  value={content.hero.subtitle}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, subtitle: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Описание</Label>
                <Textarea
                  value={content.hero.description}
                  onChange={(e) => setContent({
                    ...content,
                    hero: { ...content.hero, description: e.target.value }
                  })}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO Section */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                SEO настройки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Title (заголовок вкладки)</Label>
                <Input
                  value={content.seo.title}
                  onChange={(e) => setContent({
                    ...content,
                    seo: { ...content.seo, title: e.target.value }
                  })}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Рекомендуется до 60 символов
                </p>
              </div>
              <div>
                <Label>Meta Description</Label>
                <Textarea
                  value={content.seo.description}
                  onChange={(e) => setContent({
                    ...content,
                    seo: { ...content.seo, description: e.target.value }
                  })}
                  rows={3}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Рекомендуется до 160 символов
                </p>
              </div>
              <div>
                <Label>Keywords</Label>
                <Input
                  value={content.seo.keywords}
                  onChange={(e) => setContent({
                    ...content,
                    seo: { ...content.seo, keywords: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-600" />
                Секция "О нас"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={content.about.title}
                  onChange={(e) => setContent({
                    ...content,
                    about: { ...content.about, title: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Текст</Label>
                <Textarea
                  value={content.about.text}
                  onChange={(e) => setContent({
                    ...content,
                    about: { ...content.about, text: e.target.value }
                  })}
                  rows={6}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Section */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-orange-600" />
                Секция "Доставка"
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Заголовок</Label>
                <Input
                  value={content.delivery.title}
                  onChange={(e) => setContent({
                    ...content,
                    delivery: { ...content.delivery, title: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Текст</Label>
                <Textarea
                  value={content.delivery.text}
                  onChange={(e) => setContent({
                    ...content,
                    delivery: { ...content.delivery, text: e.target.value }
                  })}
                  rows={4}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Preview Note */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <p className="text-sm text-blue-800">
            <strong>Примечание:</strong> После сохранения изменения отобразятся на сайте сразу. 
            Для полной интеграции с сайтом необходимо обновить компоненты для чтения данных из localStorage.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
