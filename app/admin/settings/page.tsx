"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Phone, Mail, MapPin, Clock, CreditCard, Truck, Settings } from "lucide-react"

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  
  const [settings, setSettings] = useState({
    contacts: {
      phone: "+7 (495) 123-45-67",
      email: "hello@microgreen.ru",
      address: "Москва, ул. Зеленая, 15",
      workHours: "Ежедневно 9:00 — 21:00",
    },
    delivery: {
      mkad: "0",
      outsideMkad: "350",
      nearMo: "450",
      farMo: "600",
      freeDeliveryAmount: "2000",
    },
    payment: {
      sbpEnabled: true,
      cashEnabled: true,
      cardOnDeliveryEnabled: true,
    },
  })

  const handleSave = async () => {
    setSaving(true)
    
    // Сохраняем в localStorage
    localStorage.setItem("site-settings", JSON.stringify(settings))
    
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
          <h2 className="text-3xl font-bold text-gray-900">Настройки</h2>
          <p className="text-gray-500 mt-1">Контакты, доставка и оплата</p>
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

      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="contacts" className="gap-2">
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Контакты</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="gap-2">
            <Truck className="w-4 h-4" />
            <span className="hidden sm:inline">Доставка</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="gap-2">
            <CreditCard className="w-4 h-4" />
            <span className="hidden sm:inline">Оплата</span>
          </TabsTrigger>
        </TabsList>

        {/* Contacts */}
        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#16a34a]" />
                Контактная информация
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Телефон</Label>
                <Input
                  value={settings.contacts.phone}
                  onChange={(e) => setSettings({
                    ...settings,
                    contacts: { ...settings.contacts, phone: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={settings.contacts.email}
                  onChange={(e) => setSettings({
                    ...settings,
                    contacts: { ...settings.contacts, email: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Адрес</Label>
                <Input
                  value={settings.contacts.address}
                  onChange={(e) => setSettings({
                    ...settings,
                    contacts: { ...settings.contacts, address: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Часы работы</Label>
                <Input
                  value={settings.contacts.workHours}
                  onChange={(e) => setSettings({
                    ...settings,
                    contacts: { ...settings.contacts, workHours: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery */}
        <TabsContent value="delivery">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-blue-600" />
                Стоимость доставки
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Внутри МКАД (₽)</Label>
                  <Input
                    type="number"
                    value={settings.delivery.mkad}
                    onChange={(e) => setSettings({
                      ...settings,
                      delivery: { ...settings.delivery, mkad: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>За МКАД (₽)</Label>
                  <Input
                    type="number"
                    value={settings.delivery.outsideMkad}
                    onChange={(e) => setSettings({
                      ...settings,
                      delivery: { ...settings.delivery, outsideMkad: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ближнее Подмосковье (₽)</Label>
                  <Input
                    type="number"
                    value={settings.delivery.nearMo}
                    onChange={(e) => setSettings({
                      ...settings,
                      delivery: { ...settings.delivery, nearMo: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Область до 50км (₽)</Label>
                  <Input
                    type="number"
                    value={settings.delivery.farMo}
                    onChange={(e) => setSettings({
                      ...settings,
                      delivery: { ...settings.delivery, farMo: e.target.value }
                    })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div>
                <Label>Бесплатная доставка от (₽)</Label>
                <Input
                  type="number"
                  value={settings.delivery.freeDeliveryAmount}
                  onChange={(e) => setSettings({
                    ...settings,
                    delivery: { ...settings.delivery, freeDeliveryAmount: e.target.value }
                  })}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Способы оплаты
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.payment.sbpEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, sbpEnabled: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[#16a34a]"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Система быстрых платежей (СБП)</p>
                    <p className="text-sm text-gray-500">Оплата по QR-коду</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.payment.cashEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, cashEnabled: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[#16a34a]"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Наличными при получении</p>
                    <p className="text-sm text-gray-500">Оплата курьеру</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={settings.payment.cardOnDeliveryEnabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      payment: { ...settings.payment, cardOnDeliveryEnabled: e.target.checked }
                    })}
                    className="w-5 h-5 accent-[#16a34a]"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Картой при получении</p>
                    <p className="text-sm text-gray-500">Через терминал курьера</p>
                  </div>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Card */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Settings className="w-5 h-5 text-gray-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-gray-900">Информация</h4>
              <p className="text-sm text-gray-600 mt-1">
                Все настройки сохраняются локально в браузере. Для полной интеграции 
                с сайтом необходимо подключение к базе данных.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
