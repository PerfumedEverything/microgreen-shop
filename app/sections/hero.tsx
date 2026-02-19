"use client";

import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Leaf, Star, Truck, Shield, Clock, Box } from "lucide-react";
import { cn } from "@/lib/utils";

// Animated floating shape component
function FloatingShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-[#16a34a]/10",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute pointer-events-none", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{ width, height }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/20",
            "shadow-[0_8px_32px_0_rgba(22,163,74,0.15)]",
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export function HeroSection() {
  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: "easeOut" as const,
      },
    }),
  };

  return (
    <section className="relative h-screen overflow-hidden bg-gradient-to-br from-[#fafaf9] via-[#fafaf9] to-[#dcfce7]">
      {/* Animated Floating Geometric Shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FloatingShape
          delay={0.3}
          width={500}
          height={120}
          rotate={12}
          gradient="from-[#16a34a]/15"
          className="left-[-10%] md:left-[-5%] top-[10%] md:top-[15%]"
        />
        <FloatingShape
          delay={0.5}
          width={400}
          height={100}
          rotate={-15}
          gradient="from-[#22c55e]/15"
          className="right-[-5%] md:right-[0%] top-[60%] md:top-[65%]"
        />
        <FloatingShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-[#16a34a]/10"
          className="left-[5%] md:left-[10%] bottom-[10%] md:bottom-[15%]"
        />
        <FloatingShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-[#22c55e]/10"
          className="right-[15%] md:right-[20%] top-[5%] md:top-[10%]"
        />
        <FloatingShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-[#16a34a]/10"
          className="left-[20%] md:left-[25%] top-[3%] md:top-[8%]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center relative z-10 pt-[72px]">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="z-10"
          >
            <motion.div
              custom={0}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <Badge className="mb-6 bg-white border border-border text-[#16a34a] hover:bg-white shadow-sm cursor-default">
                <Star className="w-4 h-4 mr-2 text-[#16a34a] fill-[#16a34a]" />
                Более 5000 довольных клиентов
              </Badge>
            </motion.div>

            <motion.div
              custom={1}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6 font-display tracking-tight">
                Свежая микрозелень
                <span className="block text-[#16a34a]">
                  у вас дома за 2 часа
                </span>
              </h1>
            </motion.div>

            <motion.div
              custom={2}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <p className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed">
                Выращиваем с любовью, доставляем с заботой. Органические
                микрозелень и съедобные цветы для ваших блюд. Без пестицидов и
                химикатов — только чистая природная польза.
              </p>
            </motion.div>

            <motion.div
              custom={3}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  size="lg"
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <Leaf className="w-5 h-5 mr-2" />
                  Выбрать микрозелень
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 hover:border-[#16a34a] hover:text-[#16a34a] cursor-pointer"
                >
                  Как это работает
                </Button>
              </div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              custom={4}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap gap-6 pt-6 border-t border-border"
            >
              {[
                {
                  icon: Truck,
                  title: "Доставка 2 часа",
                  desc: "По Москве и МО",
                },
                { icon: Shield, title: "100% органик", desc: "Без пестицидов" },
                { icon: Star, title: "Свежий урожай", desc: "Ежедневный сбор" },
              ].map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 group cursor-pointer"
                  whileHover={{ x: 5 }}
                >
                  <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center text-[#16a34a] transition-transform group-hover:scale-110">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold text-foreground">
                      {item.title}
                    </div>
                    <div className="text-muted-foreground">{item.desc}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <motion.div
              className="relative rounded-2xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80"
                alt="Свежая микрозелень в деревянном ящике"
                width={500}
                height={400}
                className="w-full max-w-[500px] h-auto object-cover"
                priority
              />
            </motion.div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl p-4 shadow-lg hidden lg:flex items-center gap-3 max-w-[180px] cursor-pointer transition-shadow hover:shadow-xl"
            >
              <div className="w-11 h-11 bg-[#dcfce7] rounded-lg flex items-center justify-center text-[#16a34a] shrink-0">
                <Box className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-foreground">
                  Эко-упаковка
                </div>
                <div className="text-muted-foreground text-xs">
                  Без пластика
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.05 }}
              className="absolute bottom-8 -left-6 bg-white rounded-xl p-4 shadow-lg hidden lg:flex items-center gap-3 max-w-[200px] cursor-pointer transition-shadow hover:shadow-xl"
            >
              <div className="w-11 h-11 bg-[#dcfce7] rounded-lg flex items-center justify-center text-[#16a34a] shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-sm">
                <div className="font-semibold text-foreground">
                  Срок годности
                </div>
                <div className="text-muted-foreground text-xs">
                  До 7 дней в холодильнике
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
