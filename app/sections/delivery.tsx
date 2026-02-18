"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Truck, 
  Clock, 
  Shield, 
  MapPin, 
  Package, 
  Thermometer,
  Leaf,
  ChevronRight
} from "lucide-react"
import Image from "next/image"

const deliveryFeatures = [
  {
    icon: Clock,
    title: "2 часа",
    description: "Среднее время доставки по Москве",
    color: "#16a34a",
  },
  {
    icon: Truck,
    title: "Бесплатно",
    description: "При заказе от 2000 ₽ по Москве",
    color: "#22c55e",
  },
  {
    icon: Shield,
    title: "Гарантия",
    description: "Свежий урожай каждый день",
    color: "#16a34a",
  },
  {
    icon: Package,
    title: "Эко-упаковка",
    description: "Без пластика, перерабатываемая",
    color: "#22c55e",
  },
]

const deliverySteps = [
  {
    step: "01",
    title: "Сбор заказа",
    description: "Аккуратно собираем ваш заказ утром в день доставки",
    icon: Leaf,
  },
  {
    step: "02",
    title: "Упаковка",
    description: "Упаковываем в специальные контейнеры для сохранения свежести",
    icon: Package,
  },
  {
    step: "03",
    title: "Доставка",
    description: "Доставляем в течение 2 часов курьером",
    icon: Truck,
  },
  {
    step: "04",
    title: "Получение",
    description: "Принимайте свежую микрозелень и наслаждайтесь!",
    icon: Thermometer,
  },
]

const coverageAreas = [
  "Москва (внутри МКАД)",
  "Москва (за МКАД)",
  "Ближнее Подмосковье",
  "Область (до 50 км)",
]

export function DeliverySection() {
  return (
    <section id="delivery" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#16a34a]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#22c55e]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-[#dcfce7] text-[#16a34a] hover:bg-[#dcfce7] border-0">
            <Truck className="w-4 h-4 mr-2" />
            Доставка
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-display">
            Как мы доставляем
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Быстрая доставка свежей микрозелени по Москве и Московской области. 
            Сохраняем свежесть на каждом этапе.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {deliveryFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-[#fafaf9] p-6 rounded-2xl border border-border hover:border-[#16a34a]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
            >
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${feature.color}15` }}
              >
                <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Process & Coverage */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-8 font-display">
              Процесс доставки
            </h3>
            <div className="space-y-6">
              {deliverySteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-[#16a34a] text-white flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {step.step}
                    </div>
                    {index < deliverySteps.length - 1 && (
                      <div className="w-0.5 flex-1 bg-[#16a34a]/20 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <step.icon className="w-5 h-5 text-[#16a34a]" />
                      <h4 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h4>
                    </div>
                    <p className="text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Coverage & Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80"
                alt="Доставка микрозелени"
                width={600}
                height={400}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm opacity-90">Работаем ежедневно</p>
                  <p className="text-2xl font-bold">9:00 — 21:00</p>
                </div>
              </div>
            </div>

            {/* Coverage Areas */}
            <div className="bg-[#fafaf9] rounded-2xl p-6 border border-border">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-6 h-6 text-[#16a34a]" />
                <h3 className="text-xl font-bold text-foreground">
                  Зона доставки
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {coverageAreas.map((area, index) => (
                  <div
                    key={area}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
                    <span className="text-sm">{area}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-[#16a34a]">350 ₽</span> — доставка за МКАД и в область
                </p>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg hover:shadow-xl transition-all group"
            >
              Оформить заказ
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
