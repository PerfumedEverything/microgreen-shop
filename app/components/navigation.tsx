"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ShoppingCart, Leaf } from "lucide-react"
import { useCartStore } from "@/app/stores/cartStore"

const navItems = [
  { label: "Каталог", href: "/catalog" },
  { label: "Доставка", href: "#delivery" },
  { label: "О нас", href: "#about" },
  { label: "Контакты", href: "#contacts" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { getTotalItems } = useCartStore()
  const cartItemsCount = getTotalItems()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-border" 
          : "bg-white/80"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 text-2xl font-bold text-[#16a34a] font-display cursor-pointer"
          >
            <Leaf className="w-8 h-8" />
            MicroGreen
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-semibold text-foreground hover:text-[#16a34a] transition-colors py-3 border-b border-border cursor-pointer"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#16a34a] transition-all group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link href="/cart">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative hover:text-[#16a34a] cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#16a34a] text-white text-xs font-bold rounded-full flex items-center justify-center animate-in zoom-in">
                    {cartItemsCount > 99 ? "99+" : cartItemsCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="hover:text-[#16a34a] hover:bg-[#dcfce7]/50">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-semibold text-foreground hover:text-[#16a34a] transition-colors py-3 border-b border-border"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link href="/cart" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="mt-4 w-full bg-[#16a34a] hover:bg-[#15803d] cursor-pointer">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Корзина ({cartItemsCount})
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </header>
  )
}
