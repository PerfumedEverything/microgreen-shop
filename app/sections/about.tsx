"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Leaf, 
  Heart, 
  Award, 
  Users, 
  Sprout,
  Droplets,
  Sun,
  ArrowRight
} from "lucide-react"
import Image from "next/image"

const stats = [
  { value: "5+", label: "Лет опыта", suffix: "" },
  { value: "5000", label: "Довольных клиентов", suffix: "+" },
  { value: "15", label: "Видов микрозелени", suffix: "" },
  { value: "2", label: "Часа до доставки", suffix: "" },
]

const values = [
  {
    icon: Leaf,
    title: "100% Органик",
    description: "Только натуральные семена без ГМО. Никаких пестицидов и химикатов — только чистая природа.",
  },
  {
    icon: Heart,
    title: "С любовью",
    description: "Каждый листочек выращен с заботой. Мы следим за каждым этапом роста наших растений.",
  },
  {
    icon: Sprout,
    title: "Свежий урожай",
    description: "Собираем микрозелень утром в день доставки. Максимальная свежесть гарантирована.",
  },
  {
    icon: Droplets,
    title: "Чистая вода",
    description: "Используем фильтрованную воду для полива. Заботимся о качестве на каждом этапе.",
  },
]

const processSteps = [
  {
    icon: Sun,
    title: "Выращивание",
    description: "Выращиваем в контролируемых условиях с оптимальным освещением",
  },
  {
    icon: Droplets,
    title: "Уход",
    description: "Регулярный полив и забота о каждом растении",
  },
  {
    icon: Leaf,
    title: "Сбор",
    description: "Аккуратно собираем в пик свежести",
  },
  {
    icon: Heart,
    title: "Доставка",
    description: "Быстро доставляем прямо к вашей двери",
  },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 bg-[#fafaf9] relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-[#16a34a]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-[#dcfce7] text-[#16a34a] hover:bg-[#dcfce7] border-0">
            <Award className="w-4 h-4 mr-2" />
            О компании
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-display">
            Наша история
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MicroGreen — это команда энтузиастов, которые любят свою работу и верят в силу 
            натуральных продуктов. Мы выращиваем микрозелень с 2019 года и за это время 
            приобрели тысячи довольных клиентов по всей Москве.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <Card className="bg-white border-border/60 p-8 md:p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-[#16a34a] mb-2">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=800&q=80"
                alt="Процесс выращивания микрозелени"
                width={600}
                height={500}
                className="w-full h-[400px] object-cover"
              />
            </div>
            {/* Floating Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border border-border max-w-[250px] hidden md:block"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#dcfce7] rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-[#16a34a]" />
                </div>
                <div className="text-2xl font-bold text-[#16a34a]">100%</div>
              </div>
              <p className="text-sm text-muted-foreground">
                Наши клиенты рекомендуют нас друзьям
              </p>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-foreground font-display">
              Почему мы?
            </h3>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Мы начали свой путь с небольшой фермы на подоконнике и выросли в полноценное 
                производство, сохранив при этом внимание к каждому растению и любовь к своему делу.
              </p>
              <p>
                Наша миссия — сделать здоровое питание доступным каждому. Мы верим, что 
                микрозелень — это не просто модное слово, а настоящий суперфуд, который 
                может улучшить здоровье и качество жизни.
              </p>
              <p>
                Каждый день мы работаем над тем, чтобы наша продукция была свежее, 
                качественнее и доступнее. Мы гордимся тем, что делаем!
              </p>
            </div>
            <Button className="bg-[#16a34a] hover:bg-[#15803d] text-white group">
              Узнать больше
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-10 font-display">
            Наши ценности
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white p-6 rounded-2xl border border-border hover:border-[#16a34a]/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
              >
                <div className="w-14 h-14 bg-[#dcfce7] rounded-xl flex items-center justify-center text-[#16a34a] mb-4 transition-transform duration-300 group-hover:scale-110">
                  <value.icon className="w-7 h-7" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {value.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Process */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-foreground text-center mb-10 font-display">
            От семечка до вашего стола
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="w-16 h-16 bg-[#16a34a] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg">
                  <step.icon className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-[#16a34a]/20" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
