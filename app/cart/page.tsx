"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Truck, 
  MapPin, 
  CreditCard, 
  Wallet,
  Check,
  ChevronRight,
  ArrowLeft,
  Clock,
  Shield,
  Leaf,
  RotateCcw,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/stores/cartStore"

// Delivery zones
const deliveryZones = [
  {
    id: "mkad",
    name: "Москва (внутри МКАД)",
    price: 0,
    minOrder: 2000,
    time: "2 часа",
  },
  {
    id: "outside-mkad",
    name: "Москва (за МКАД)",
    price: 350,
    minOrder: 3000,
    time: "2-3 часа",
  },
  {
    id: "near-mo",
    name: "Ближнее Подмосковье",
    price: 450,
    minOrder: 4000,
    time: "3-4 часа",
  },
  {
    id: "far-mo",
    name: "Область (до 50 км)",
    price: 600,
    minOrder: 5000,
    time: "4-5 часов",
  },
]

// Payment methods
const paymentMethods = [
  {
    id: "sbp",
    name: "Система быстрых платежей (СБП)",
    description: "Оплата по QR-коду через банковское приложение",
    icon: CreditCard,
    instant: true,
  },
  {
    id: "cash",
    name: "Наличными при получении",
    description: "Оплата курьеру при доставке",
    icon: Wallet,
    instant: false,
  },
  {
    id: "card-on-delivery",
    name: "Картой при получении",
    description: "Оплата картой курьеру через терминал",
    icon: CreditCard,
    instant: false,
  },
]

export default function CartPage() {
  const { 
    items: cartItems, 
    updateQuantity, 
    removeItem, 
    restoreItem, 
    recentlyRemoved,
    clearRecentlyRemoved,
    getTotalPrice 
  } = useCartStore()

  const [selectedZone, setSelectedZone] = useState(deliveryZones[0])
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0])
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    apartment: "",
    entrance: "",
    floor: "",
    comment: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === "green10") {
      setPromoApplied(true)
    }
  }

  // Calculate totals
  const subtotal = getTotalPrice()
  const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
  const deliveryPrice = subtotal >= selectedZone.minOrder ? 0 : selectedZone.price
  const total = subtotal - discount + deliveryPrice

  // Submit order
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setOrderComplete(true)
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-[#fafaf9] pt-[72px]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-border p-8 text-center"
          >
            <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-[#16a34a]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4 font-display">
              Заказ оформлен!
            </h1>
            <p className="text-muted-foreground mb-6">
              Номер вашего заказа: <span className="font-semibold text-[#16a34a]">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
            </p>
            <p className="text-muted-foreground mb-8">
              {selectedPayment.id === "sbp" 
                ? "Перейдите по ссылке в SMS для оплаты через СБП"
                : "Оплата при получении. Курьер свяжется с вами за час до доставки."
              }
            </p>
            <div className="bg-[#fafaf9] rounded-xl p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-5 h-5 text-[#16a34a]" />
                <span className="font-medium">Доставка: {selectedZone.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#16a34a]" />
                <span className="font-medium">{formData.address}</span>
              </div>
            </div>
            <Link href="/">
              <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white">
                Вернуться на главную
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0 && recentlyRemoved.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafaf9] pt-[72px]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border p-8 text-center"
          >
            <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-[#16a34a]" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4 font-display">
              Корзина пуста
            </h1>
            <p className="text-muted-foreground mb-8">
              Добавьте товары из каталога, чтобы оформить заказ
            </p>
            <Link href="/catalog">
              <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white">
                Перейти в каталог
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-[72px]">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-[#16a34a] transition-colors cursor-pointer">Главная</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/catalog" className="hover:text-[#16a34a] transition-colors cursor-pointer">Каталог</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Корзина</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display">Оформление заказа</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Cart Items & Form */}
          <div className="flex-1 space-y-6">
            {/* Recently Removed Items */}
            <AnimatePresence>
              {recentlyRemoved.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-orange-50 rounded-2xl border border-orange-200 p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-orange-700">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Недавно удалены</span>
                    </div>
                    <button
                      onClick={clearRecentlyRemoved}
                      className="text-sm text-orange-600 hover:text-orange-800 cursor-pointer"
                    >
                      Очистить
                    </button>
                  </div>
                  <div className="space-y-2">
                    {recentlyRemoved.map((item) => (
                      <motion.div
                        key={`${item.id}-${item.removedAt}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between bg-white rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              className="object-cover opacity-50"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-muted-foreground line-through">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Удален из корзины</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => restoreItem(item.id)}
                          className="text-[#16a34a] hover:text-[#15803d] hover:bg-[#dcfce7]"
                        >
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Вернуть
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Cart Items */}
            {cartItems.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#16a34a]" />
                  Товары в корзине ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})
                </h2>
                
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {cartItems.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100, backgroundColor: "#fee2e2" }}
                        transition={{ duration: 0.3 }}
                        className="flex gap-4 p-4 bg-[#fafaf9] rounded-xl group"
                      >
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{item.name}</h3>
                              <span className="text-sm text-muted-foreground">{item.weight}</span>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-muted-foreground hover:text-red-500 transition-colors cursor-pointer p-1 opacity-0 group-hover:opacity-100"
                              title="Удалить из корзины"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-border">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="h-8 w-8 hover:bg-[#16a34a] hover:text-white cursor-pointer"
                              >
                                <Minus className="w-4 h-4" />
                              </Button>
                              <span className="w-8 text-center font-semibold">{item.quantity}</span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="h-8 w-8 hover:bg-[#16a34a] hover:text-white cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <span className="text-xl font-bold text-[#16a34a]">
                              {item.price * item.quantity} ₽
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Continue Shopping */}
            {cartItems.length === 0 && recentlyRemoved.length > 0 && (
              <div className="bg-white rounded-2xl border border-border p-6 text-center">
                <p className="text-muted-foreground mb-4">Все товары были удалены из корзины</p>
                <Link href="/catalog">
                  <Button variant="outline" className="border-[#16a34a] text-[#16a34a] hover:bg-[#dcfce7]">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Вернуться к покупкам
                  </Button>
                </Link>
              </div>
            )}

            {/* Delivery Address Form */}
            {cartItems.length > 0 && (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-border p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#16a34a]" />
                  Адрес доставки
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="name">Имя получателя *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Иван Иванов"
                      required
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+7 (999) 123-45-67"
                      required
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Адрес доставки *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="г. Москва, ул. Примерная, д. 1"
                      required
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="apartment">Квартира/Офис</Label>
                    <Input
                      id="apartment"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      placeholder="кв. 10"
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entrance">Подъезд</Label>
                    <Input
                      id="entrance"
                      value={formData.entrance}
                      onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                      placeholder="1"
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floor">Этаж</Label>
                    <Input
                      id="floor"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      placeholder="3"
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="comment">Комментарий к заказу</Label>
                    <Input
                      id="comment"
                      value={formData.comment}
                      onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                      placeholder="Код домофона, удобное время доставки и т.д."
                      className="mt-1 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Right Column - Order Summary */}
          {cartItems.length > 0 && (
            <div className="lg:w-96 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-border p-6 sticky top-[220px]">
                <h2 className="text-xl font-semibold mb-6">Итого заказа</h2>

                {/* Delivery Zone Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#16a34a]" />
                    Зона доставки
                  </h3>
                  <div className="space-y-2">
                    {deliveryZones.map((zone) => (
                      <button
                        key={zone.id}
                        onClick={() => setSelectedZone(zone)}
                        className={`w-full p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedZone.id === zone.id
                            ? "border-[#16a34a] bg-[#dcfce7]/50"
                            : "border-border hover:border-[#16a34a]/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{zone.name}</span>
                          <span className={`text-sm font-semibold ${zone.price === 0 ? "text-[#16a34a]" : ""}`}>
                            {zone.price === 0 ? "Бесплатно" : `${zone.price} ₽`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{zone.time}</span>
                        </div>
                        {subtotal < zone.minOrder && (
                          <p className="text-xs text-orange-500 mt-1">
                            При заказе от {zone.minOrder} ₽ — бесплатно
                          </p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <Label className="text-sm">Промокод</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value)
                        setPromoApplied(false)
                      }}
                      placeholder="Введите код"
                      className="border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={applyPromoCode}
                      disabled={!promoCode || promoApplied}
                      className="whitespace-nowrap"
                    >
                      Применить
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-[#16a34a] mt-2">
                      Промокод применен! Скидка 10%
                    </p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Товары ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} шт)</span>
                    <span>{subtotal} ₽</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Скидка по промокоду</span>
                      <span className="text-[#16a34a]">-{discount} ₽</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Доставка</span>
                    <span className={deliveryPrice === 0 ? "text-[#16a34a]" : ""}>
                      {deliveryPrice === 0 ? "Бесплатно" : `${deliveryPrice} ₽`}
                    </span>
                  </div>
                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-lg">К оплате</span>
                      <span className="font-bold text-2xl text-[#16a34a]">{total} ₽</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Способ оплаты</h3>
                  <div className="space-y-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setSelectedPayment(method)}
                        className={`w-full p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          selectedPayment.id === method.id
                            ? "border-[#16a34a] bg-[#dcfce7]/50"
                            : "border-border hover:border-[#16a34a]/50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                            selectedPayment.id === method.id ? "bg-[#16a34a] text-white" : "bg-muted"
                          }`}>
                            <method.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-medium text-sm">{method.name}</div>
                            <div className="text-xs text-muted-foreground">{method.description}</div>
                            {method.instant && (
                              <Badge className="mt-1 bg-[#dcfce7] text-[#16a34a] border-0 text-xs">
                                <Shield className="w-3 h-3 mr-1" />
                                Моментально
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.phone || !formData.address}
                  className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Оформление...
                    </>
                  ) : selectedPayment.id === "sbp" ? (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" />
                      Оплатить {total} ₽
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Оформить заказ
                    </>
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Безопасная оплата и доставка</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
