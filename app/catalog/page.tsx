"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Leaf, 
  Search, 
  SlidersHorizontal,
  X,
  ChevronDown,
  Grid3X3,
  LayoutList,
  Check,
  ArrowRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCartStore } from "@/app/stores/cartStore"

// Product Type
interface Product {
  id: number
  name: string
  price: number
  weight: string
  description: string
  image: string
  category: string
  isNew?: boolean
  isBestseller?: boolean
  stock: number
}

// Full product catalog
const allProducts: Product[] = [
  {
    id: 1,
    name: "Микрозелень гороха",
    price: 350,
    weight: "50 г",
    description: "Нежный вкус, богата белком и витаминами",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&q=80",
    category: "legumes",
    isBestseller: true,
    stock: 50,
  },
  {
    id: 2,
    name: "Микрозелень подсолнуха",
    price: 380,
    weight: "50 г",
    description: "Сочная, с легким ореховым привкусом",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
    category: "seeds",
    stock: 45,
  },
  {
    id: 3,
    name: "Микрозелень редиса",
    price: 320,
    weight: "50 г",
    description: "Острая, пикантная, идеальна для салатов",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80",
    category: "vegetables",
    isNew: true,
    stock: 30,
  },
  {
    id: 4,
    name: "Микрозелень брокколи",
    price: 420,
    weight: "50 г",
    description: "Мягкий вкус, максимум пользы",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    category: "vegetables",
    isBestseller: true,
    stock: 40,
  },
  {
    id: 5,
    name: "Микрозелень рукколы",
    price: 360,
    weight: "50 г",
    description: "Перечный аромат, отлично для пиццы",
    image: "https://images.unsplash.com/photo-1603618090554-11bfb6b1a1ef?w=600&q=80",
    category: "vegetables",
    stock: 35,
  },
  {
    id: 6,
    name: "Микрозелень свеклы",
    price: 340,
    weight: "50 г",
    description: "Сладковатая, красивый бордовый цвет",
    image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?w=600&q=80",
    category: "vegetables",
    isNew: true,
    stock: 25,
  },
  {
    id: 7,
    name: "Микрозелень базилика",
    price: 450,
    weight: "30 г",
    description: "Ароматная, идеальна для итальянских блюд",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80",
    category: "herbs",
    isBestseller: true,
    stock: 55,
  },
  {
    id: 8,
    name: "Микрозелень кинзы",
    price: 330,
    weight: "50 г",
    description: "Свежий аромат, прекрасна для азиатской кухни",
    image: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=600&q=80",
    category: "herbs",
    stock: 48,
  },
  {
    id: 9,
    name: "Микрозелень щавеля",
    price: 310,
    weight: "50 г",
    description: "Кисловатый вкус, богат витамином С",
    image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
    category: "vegetables",
    stock: 20,
  },
  {
    id: 10,
    name: "Микрозелень мяты",
    price: 400,
    weight: "30 г",
    description: "Освежающий аромат, для напитков и десертов",
    image: "https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=600&q=80",
    category: "herbs",
    isNew: true,
    stock: 42,
  },
  {
    id: 11,
    name: "Микрозелень лука",
    price: 290,
    weight: "50 г",
    description: "Нежный луковый вкус, для салатов и супов",
    image: "https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=600&q=80",
    category: "vegetables",
    stock: 60,
  },
  {
    id: 12,
    name: "Микрозелень капусты",
    price: 280,
    weight: "50 г",
    description: "Нежная, слегка сладковатая",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&q=80",
    category: "vegetables",
    stock: 38,
  },
]

// Categories
const categories = [
  { id: "all", name: "Все", count: allProducts.length },
  { id: "vegetables", name: "Овощи", count: allProducts.filter(p => p.category === "vegetables").length },
  { id: "herbs", name: "Зелень", count: allProducts.filter(p => p.category === "herbs").length },
  { id: "legumes", name: "Бобовые", count: allProducts.filter(p => p.category === "legumes").length },
  { id: "seeds", name: "Семена", count: allProducts.filter(p => p.category === "seeds").length },
]

// Sort options
const sortOptions = [
  { id: "popular", name: "По популярности" },
  { id: "price-asc", name: "Цена: по возрастанию" },
  { id: "price-desc", name: "Цена: по убыванию" },
  { id: "name", name: "По названию" },
  { id: "new", name: "Сначала новинки" },
]

function ProductCard({ product, viewMode }: { product: Product; viewMode: "grid" | "list" }) {
  const [isHovered, setIsHovered] = useState(false)
  const { addItem, updateQuantity, removeItem, getItemQuantity, isInCart } = useCartStore()
  
  const quantity = getItemQuantity(product.id)
  const inCart = isInCart(product.id)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: product.weight,
      image: product.image,
    })
  }

  const handleIncrement = () => {
    updateQuantity(product.id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1)
    } else {
      removeItem(product.id)
    }
  }

  if (viewMode === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group bg-white rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${
          inCart ? "border-[#16a34a] shadow-md" : "border-border hover:shadow-lg"
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex flex-col sm:flex-row">
          {/* Image */}
          <div className="relative w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 overflow-hidden bg-muted">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {product.isNew && (
                <Badge className="bg-[#22c55e] text-white border-0">Новинка</Badge>
              )}
              {product.isBestseller && (
                <Badge className="bg-[#16a34a] text-white border-0">Хит</Badge>
              )}
            </div>
            {/* In Cart Indicator */}
            {inCart && (
              <div className="absolute top-3 right-3 bg-[#16a34a] text-white rounded-full p-2 shadow-lg">
                <Check className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-foreground text-lg">{product.name}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {product.weight}
                </span>
                {inCart && (
                  <Badge className="bg-[#dcfce7] text-[#16a34a] border-0 text-xs">
                    В корзине
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>В наличии: {product.stock} шт</span>
              </div>
            </div>

            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3">
              <span className="text-2xl font-bold text-[#16a34a]">{product.price} ₽</span>
              
              {!inCart ? (
                <Button 
                  onClick={handleAddToCart} 
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  В корзину
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
                  <span className="w-8 text-center font-semibold text-[#16a34a]">{quantity}</span>
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
        </div>
      </motion.div>
    )
  }

  // Grid view
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`group rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer ${
        inCart 
          ? "border-[#16a34a] shadow-lg ring-2 ring-[#16a34a]/20" 
          : "border-border hover:shadow-xl hover:-translate-y-1"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && <Badge className="bg-[#22c55e] text-white border-0">Новинка</Badge>}
          {product.isBestseller && <Badge className="bg-[#16a34a] text-white border-0">Хит</Badge>}
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

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 text-center max-w-[200px]">
            <Leaf className="w-6 h-6 text-[#16a34a] mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">{product.description}</p>
          </div>
        </motion.div>
      </div>

      <div className="p-5 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg leading-tight">{product.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{product.weight}</span>
              {inCart && (
                <Badge className="bg-[#dcfce7] text-[#16a34a] border-0 text-xs">
                  <Check className="w-3 h-3 mr-1" />
                  В корзине
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-[#16a34a]">{product.price} ₽</span>
          {!inCart ? (
            <Button 
              onClick={handleAddToCart} 
              className="bg-[#16a34a] hover:bg-[#15803d] text-white shadow-md hover:shadow-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              В корзину
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
              <span className="w-8 text-center font-semibold text-[#16a34a]">{quantity}</span>
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
  )
}

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState<{ min: string; max: string }>({ min: "", max: "" })
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false)
  const { getTotalItems, getTotalPrice } = useCartStore()

  const cartItemsCount = getTotalItems()
  const cartTotal = getTotalPrice()

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = [...allProducts]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query)
      )
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(p => p.category === selectedCategory)
    }

    // Price range filter
    const min = parseInt(priceRange.min) || 0
    const max = parseInt(priceRange.max) || Infinity
    result = result.filter(p => p.price >= min && p.price <= max)

    // New items filter
    if (showNewOnly) {
      result = result.filter(p => p.isNew)
    }

    // Bestsellers filter
    if (showBestsellersOnly) {
      result = result.filter(p => p.isBestseller)
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        result.sort((a, b) => b.price - a.price)
        break
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "new":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
        break
      default:
        // Popular: bestsellers first, then by stock
        result.sort((a, b) => {
          if (a.isBestseller && !b.isBestseller) return -1
          if (!a.isBestseller && b.isBestseller) return 1
          return b.stock - a.stock
        })
    }

    return result
  }, [searchQuery, selectedCategory, sortBy, priceRange, showNewOnly, showBestsellersOnly])

  const activeFiltersCount = [
    selectedCategory !== "all",
    priceRange.min || priceRange.max,
    showNewOnly,
    showBestsellersOnly
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-[72px]">
      {/* Header */}
      <div className="bg-white border-b border-border sticky top-[72px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-[#16a34a] transition-colors cursor-pointer">Главная</Link>
            <span>/</span>
            <span className="text-foreground">Каталог</span>
          </div>

          {/* Title and Search */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground font-display">Каталог микрозелени</h1>
              <p className="text-muted-foreground mt-1">{filteredProducts.length} товаров</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-64 border-border/60 focus:border-[#16a34a] focus:ring-[#16a34a]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                )}
              </div>

              {/* Cart Summary Button */}
              {cartItemsCount > 0 && (
                <Link href="/cart">
                  <Button 
                    variant="outline" 
                    className="hidden sm:flex items-center gap-2 border-[#16a34a] text-[#16a34a] hover:bg-[#dcfce7]"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>{cartItemsCount} шт</span>
                    <span className="font-semibold">{cartTotal} ₽</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              )}

              {/* Filter Button (Mobile) */}
              <Button
                variant="outline"
                className="lg:hidden relative"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#16a34a] text-white text-xs rounded-full flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl border border-border p-6 sticky top-[220px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg">Фильтры</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={() => {
                      setSelectedCategory("all")
                      setPriceRange({ min: "", max: "" })
                      setShowNewOnly(false)
                      setShowBestsellersOnly(false)
                    }}
                    className="text-sm text-[#16a34a] hover:underline cursor-pointer"
                  >
                    Сбросить
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Категории</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? "bg-[#dcfce7] text-[#16a34a]"
                          : "hover:bg-muted"
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-sm text-muted-foreground">{cat.count}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Цена</h4>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="От"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-24 border-border/60"
                  />
                  <span className="text-muted-foreground">—</span>
                  <Input
                    type="number"
                    placeholder="До"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-24 border-border/60"
                  />
                </div>
              </div>

              {/* Special Filters */}
              <div>
                <h4 className="font-medium mb-3">Особые</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={showNewOnly}
                      onChange={(e) => setShowNewOnly(e.target.checked)}
                      className="w-4 h-4 accent-[#16a34a]"
                    />
                    <span>Только новинки</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded-lg transition-colors">
                    <input
                      type="checkbox"
                      checked={showBestsellersOnly}
                      onChange={(e) => setShowBestsellersOnly(e.target.checked)}
                      className="w-4 h-4 accent-[#16a34a]"
                    />
                    <span>Только хиты</span>
                  </label>
                </div>
              </div>

              {/* Mobile Cart Button */}
              {cartItemsCount > 0 && (
                <div className="mt-6 pt-6 border-t border-border lg:hidden">
                  <Link href="/cart">
                    <Button className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      В корзину ({cartItemsCount} шт)
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white rounded-xl border border-border p-4">
              <div className="flex items-center gap-4">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-transparent pr-8 py-2 pl-3 border border-border rounded-lg focus:border-[#16a34a] focus:ring-1 focus:ring-[#16a34a] cursor-pointer"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "grid" ? "bg-[#dcfce7] text-[#16a34a]" : "hover:bg-muted"
                  }`}
                >
                  <Grid3X3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "list" ? "bg-[#dcfce7] text-[#16a34a]" : "hover:bg-muted"
                  }`}
                >
                  <LayoutList className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Products Grid/List */}
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className={viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" 
                  : "space-y-4"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Empty State */}
            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-[#dcfce7] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-[#16a34a]" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Товары не найдены</h3>
                <p className="text-muted-foreground mb-4">Попробуйте изменить параметры поиска или фильтры</p>
                <Button
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                    setPriceRange({ min: "", max: "" })
                    setShowNewOnly(false)
                    setShowBestsellersOnly(false)
                  }}
                  className="bg-[#16a34a] hover:bg-[#15803d] text-white"
                >
                  Сбросить фильтры
                </Button>
              </motion.div>
            )}

            {/* Bottom Cart Button (Mobile) */}
            {cartItemsCount > 0 && (
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 lg:hidden z-50"
              >
                <Link href="/cart">
                  <Button className="w-full bg-[#16a34a] hover:bg-[#15803d] text-white py-6 text-lg">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Перейти в корзину
                    <span className="ml-2">({cartItemsCount} шт · {cartTotal} ₽)</span>
                  </Button>
                </Link>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
