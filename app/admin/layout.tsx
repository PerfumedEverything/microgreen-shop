"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  Image as ImageIcon, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  Leaf
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/supabase"

const adminNavItems = [
  { 
    label: "Главная", 
    href: "/admin", 
    icon: LayoutDashboard,
    description: "Обзор и статистика"
  },
  { 
    label: "Товары", 
    href: "/admin/products", 
    icon: Package,
    description: "Управление каталогом"
  },
  { 
    label: "Контент", 
    href: "/admin/content", 
    icon: FileText,
    description: "Тексты и контакты"
  },
  { 
    label: "Медиа", 
    href: "/admin/media", 
    icon: ImageIcon,
    description: "Изображения"
  },
  { 
    label: "Настройки", 
    href: "/admin/settings", 
    icon: Settings,
    description: "Конфигурация"
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
    router.refresh()
  }

  const breadcrumbs = [{ label: 'Главная', href: '/admin' }]
  if (pathname !== '/admin') {
    const currentItem = adminNavItems.find(item => pathname.startsWith(item.href) && item.href !== '/admin')
    if (currentItem) {
      breadcrumbs.push({ label: currentItem.label, href: currentItem.href })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 w-64 h-screen bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-200">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#16a34a] rounded-xl flex items-center justify-center text-white">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <span className="font-bold text-lg text-slate-900">MicroGreen</span>
                <span className="block text-xs text-slate-500">Admin Panel</span>
              </div>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-[#16a34a] text-white" 
                      : "text-slate-600 hover:bg-slate-100"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              )
            })}

            <div className="my-4 border-t border-slate-200" />
            
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <ExternalLink className="w-5 h-5" />
              <span className="font-medium">Открыть сайт</span>
            </Link>
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-200">
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-50">
              <div className="w-10 h-10 bg-[#16a34a] rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm">Администратор</p>
                <p className="text-xs text-slate-500 truncate">admin@microgreen.ru</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-600"
                title="Выйти"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Breadcrumbs */}
            <nav className="hidden md:flex items-center gap-2 text-sm text-slate-500">
              {breadcrumbs.map((crumb, index) => (
                <div key={crumb.href} className="flex items-center gap-2">
                  {index > 0 && <ChevronRight className="w-4 h-4" />}
                  {index === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-slate-900">{crumb.label}</span>
                  ) : (
                    <Link href={crumb.href} className="hover:text-[#16a34a]">
                      {crumb.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          <Link 
            href="/" 
            target="_blank"
            className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:text-[#16a34a] hover:bg-[#dcfce7] rounded-lg transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">На сайт</span>
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
