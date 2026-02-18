"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  Instagram,
  CheckCircle2
} from "lucide-react"

const contactInfo = [
  {
    icon: Phone,
    title: "Телефон",
    content: "+7 (495) 123-45-67",
    href: "tel:+74951234567",
    description: "Звоните ежедневно с 9:00 до 21:00",
  },
  {
    icon: Mail,
    title: "Email",
    content: "hello@microgreen.ru",
    href: "mailto:hello@microgreen.ru",
    description: "Отвечаем в течение часа",
  },
  {
    icon: MapPin,
    title: "Адрес",
    content: "Москва, ул. Зеленая, 15",
    description: "Самовывоз по договоренности",
  },
  {
    icon: Clock,
    title: "Часы работы",
    content: "Ежедневно 9:00 — 21:00",
    description: "Доставка работает без выходных",
  },
]

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://instagram.com/microgreen",
    color: "#E4405F",
  },
  {
    name: "Telegram",
    icon: MessageCircle,
    href: "https://t.me/microgreen",
    color: "#0088cc",
  },
]

export function ContactsSection() {
  const [formState, setFormState] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormState({ name: "", phone: "", email: "", message: "" })
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  return (
    <section id="contacts" className="py-24 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#16a34a]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-[#dcfce7] text-[#16a34a] hover:bg-[#dcfce7] border-0">
            <MessageCircle className="w-4 h-4 mr-2" />
            Контакты
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-display">
            Свяжитесь с нами
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Есть вопросы или хотите сделать заказ? Мы всегда на связи и рады помочь!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Contact Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-5 h-full border-border/60 hover:border-[#16a34a]/30 transition-all duration-300 hover:shadow-lg group cursor-pointer">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#dcfce7] rounded-xl flex items-center justify-center text-[#16a34a] shrink-0 transition-transform duration-300 group-hover:scale-110">
                        <item.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        {item.href ? (
                          <a 
                            href={item.href}
                            className="text-[#16a34a] hover:text-[#15803d] font-medium transition-colors"
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">
                            {item.content}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Мы в социальных сетях
              </h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-5 py-3 bg-[#fafaf9] rounded-xl border border-border hover:border-[#16a34a]/30 transition-all duration-300 hover:shadow-md group cursor-pointer"
                  >
                    <social.icon 
                      className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" 
                      style={{ color: social.color }}
                    />
                    <span className="font-medium text-foreground">{social.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative rounded-2xl overflow-hidden bg-[#fafaf9] border border-border h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#16a34a] mx-auto mb-3" />
                  <p className="text-muted-foreground">Москва, ул. Зеленая, 15</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    5 минут от метро "Зеленая"
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card className="p-8 border-border/60">
              <h3 className="text-2xl font-bold text-foreground mb-2 font-display">
                Напишите нам
              </h3>
              <p className="text-muted-foreground mb-6">
                Заполните форму ниже, и мы свяжемся с вами в ближайшее время
              </p>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#16a34a]" />
                  </div>
                  <h4 className="text-xl font-semibold text-foreground mb-2">
                    Сообщение отправлено!
                  </h4>
                  <p className="text-muted-foreground">
                    Мы получили ваше сообщение и ответим вам в ближайшее время
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ваше имя</Label>
                      <Input
                        id="name"
                        placeholder="Иван"
                        value={formState.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, name: e.target.value })}
                        required
                        className="border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Телефон</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+7 (999) 123-45-67"
                        value={formState.phone}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, phone: e.target.value })}
                        required
                        className="border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="ivan@example.com"
                      value={formState.email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormState({ ...formState, email: e.target.value })}
                      className="border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Сообщение</Label>
                    <Textarea
                      id="message"
                      placeholder="Расскажите о вашем заказе или задайте вопрос..."
                      value={formState.message}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormState({ ...formState, message: e.target.value })}
                      rows={4}
                      className="border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Отправка...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Отправить сообщение
                      </>
                    )}
                  </Button>
                </form>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
