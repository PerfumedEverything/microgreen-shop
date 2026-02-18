"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingCart,
  Plus,
  Minus,
  Leaf,
  ArrowRight,
  Check,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/app/stores/cartStore";

interface Product {
  id: number;
  name: string;
  price: number;
  weight: string;
  description: string;
  image: string;
  isNew?: boolean;
  isBestseller?: boolean;
}

// Only 3 bestseller products for homepage
const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Микрозелень гороха",
    price: 350,
    weight: "50 г",
    description: "Нежный вкус, богата белком и витаминами",
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    isBestseller: true,
  },
  {
    id: 7,
    name: "Микрозелень базилика",
    price: 450,
    weight: "30 г",
    description: "Ароматная, идеальна для итальянских блюд",
    image:
      "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80",
    isBestseller: true,
  },
  {
    id: 4,
    name: "Микрозелень брокколи",
    price: 420,
    weight: "50 г",
    description: "Мягкий вкус, максимум пользы",
    image:
      "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    isBestseller: true,
  },
];

function ProductCard({ product }: { product: Product }) {
  const [isHovered, setIsHovered] = useState(false);
  const { addItem, updateQuantity, removeItem, getItemQuantity, isInCart } =
    useCartStore();

  const quantity = getItemQuantity(product.id);
  const inCart = isInCart(product.id);

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image,
    });
  };

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`group rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${
        inCart
          ? "border-[#16a34a] shadow-lg ring-2 ring-[#16a34a]/20"
          : "border-border hover:shadow-xl hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <Badge className="bg-[#16a34a] hover:bg-[#16a34a] text-white border-0">
              Хит продаж
            </Badge>
          )}
        </div>

        {/* In Cart Indicator */}
        {inCart && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 bg-[#16a34a] text-white rounded-full p-2 shadow-lg"
          >
            <Check className="w-4 h-4" />
          </motion.div>
        )}

        {/* Hover Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center max-w-[200px]">
            <Leaf className="w-6 h-6 text-[#16a34a] mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">
              {product.description}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {product.weight}
              </span>
              {inCart && (
                <Badge className="bg-[#dcfce7] text-[#16a34a] border-0 text-xs">
                  <Check className="w-3 h-3 mr-1" />В корзине
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-2xl font-bold text-[#16a34a]">
              {product.price} ₽
            </span>
          </div>

          {!inCart ? (
            <Button
              onClick={handleAddToCart}
              className="bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />В корзину
            </Button>
          ) : (
            <div className="flex items-center gap-2 bg-[#dcfce7] rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDecrement}
                className="h-8 w-8 hover:bg-[#16a34a] hover:text-white"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-8 text-center font-semibold text-[#16a34a]">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleIncrement}
                className="h-8 w-8 hover:bg-[#16a34a] hover:text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export function CatalogSection() {
  const { getTotalItems } = useCartStore();
  const cartCount = getTotalItems();

  return (
    <section id="catalog" className="py-24 bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-[#dcfce7] text-[#16a34a] hover:bg-[#dcfce7] border-0">
            <Leaf className="w-4 h-4 mr-2" />
            Популярное
          </Badge>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 font-display">
            Самые популярные товары
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Наши бестселлеры — выбор тысяч довольных клиентов. Попробуйте и вы!
          </p>
          {cartCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4"
            >
              <Badge className="bg-[#16a34a] text-white border-0">
                <ShoppingCart className="w-4 h-4 mr-2" />В корзине {cartCount}{" "}
                товаров
              </Badge>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid - Only 3 items */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <Link href="/catalog">
            <Button
              size="lg"
              className="bg-[#16a34a] hover:bg-[#15803d] text-white shadow-lg hover:shadow-xl transition-all group"
            >
              Перейти в каталог
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
