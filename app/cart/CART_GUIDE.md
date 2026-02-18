# 📘 ПАМЯТКА: Реализация корзины в Next.js

## 📍 Расположение файлов

```
app/
├── cart/
│   └── page.tsx             # Страница корзины
│   └── CART_GUIDE.md        # Эта памятка
└── components/
    └── CartButton.tsx       # Кнопка корзины с счетчиком (опционально)
```

---

## 🎯 Архитектура корзины

### ДВУКОЛОНОЧНЫЙ МАКЕТ

**Левая колонка (основная)** — 70% ширины:
- ✅ Список товаров в корзине
- ✅ Форма адреса доставки
- ✅ Валидация полей

**Правая колонка (sidebar)** — 30% ширины:
- ✅ Выбор зоны доставки
- ✅ Промокод
- ✅ Итоговый расчёт
- ✅ Выбор способа оплаты
- ✅ Кнопка оформления

---

## 🧩 Функционал корзины

### 🛒 Управление товарами

```typescript
// Тип товара в корзине
interface CartItem {
  id: number
  name: string
  price: number
  weight: string
  image: string
  quantity: number  // Количество в корзине
}
```

**Операции:**
- ✅ Изменение количества (+/-)
- ✅ Удаление товара
- ✅ Анимации при изменениях (Framer Motion)
- ✅ Empty state при пустой корзине

```typescript
// Обновление количества
const updateQuantity = (id: number, delta: number) => {
  setCartItems(items => 
    items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
  )
}

// Удаление товара
const removeItem = (id: number) => {
  setCartItems(items => items.filter(item => item.id !== id))
}
```

### 🚚 Зоны доставки

```typescript
const deliveryZones = [
  {
    id: "mkad",
    name: "Москва (внутри МКАД)",
    price: 0,
    minOrder: 2000,      // Минимальная сумма для бесплатной доставки
    time: "2 часа",
  },
  {
    id: "outside-mkad",
    name: "Москва (за МКАД)",
    price: 350,
    minOrder: 3000,
    time: "2-3 часа",
  },
  // ...
]
```

**Логика расчёта:**
```typescript
// Доставка бесплатна если сумма заказа >= minOrder
const deliveryPrice = subtotal >= selectedZone.minOrder ? 0 : selectedZone.price
```

**UI элементы:**
- Список зон с radio-кнопками
- Цена доставки для каждой зоны
- Время доставки
- Подсказка о бесплатной доставке

### 💳 Способы оплаты

```typescript
const paymentMethods = [
  {
    id: "sbp",
    name: "Система быстрых платежей (СБП)",
    description: "Оплата по QR-коду через банковское приложение",
    icon: CreditCard,
    instant: true,       // Мгновенное подтверждение
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
```

**Особенности:**
- Для СБП: показываем текст "Оплатить {сумма} ₽"
- Для остальных: "Оформить заказ"
- Бейдж "Моментально" для онлайн-оплаты

### 🎟️ Промокоды

```typescript
const [promoCode, setPromoCode] = useState("")
const [promoApplied, setPromoApplied] = useState(false)

const applyPromoCode = () => {
  if (promoCode.toLowerCase() === "green10") {
    setPromoApplied(true)
  }
}

// Расчёт скидки
const discount = promoApplied ? Math.round(subtotal * 0.1) : 0
```

**Валидация:**
- Кнопка активна только если код введён
- Сброс при изменении кода
- Показ сообщения об успехе

### 📊 Расчёт итоговой суммы

```typescript
// Пошаговый расчёт
const subtotal = cartItems.reduce((sum, item) => 
  sum + item.price * item.quantity, 0
)

const discount = promoApplied ? Math.round(subtotal * 0.1) : 0

const deliveryPrice = subtotal >= selectedZone.minOrder 
  ? 0 
  : selectedZone.price

const total = subtotal - discount + deliveryPrice
```

**Отображение:**
- Товары (N шт) — сумма
- Скидка (если есть) — зелёным цветом
- Доставка — "Бесплатно" или цена
- ИТОГО — крупным шрифтом

### 📝 Форма адреса

**Обязательные поля:**
- Имя получателя
- Телефон
- Адрес доставки

**Дополнительные поля:**
- Квартира/Офис
- Подъезд
- Этаж
- Комментарий

**Валидация:**
```typescript
<Button
  disabled={
    isSubmitting || 
    !formData.name || 
    !formData.phone || 
    !formData.address
  }
>
```

---

## 🎨 UI/UX Решения

### 1. Sticky Sidebar

```css
/* Правая колонка прилипает при скролле */
position: sticky;
top: 220px;  /* Под шапку и заголовок */
```

### 2. Анимации

```typescript
// Framer Motion для товаров
<motion.div
  layout
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, x: -100 }}  // Улетает влево при удалении
>
```

### 3. Empty State

```typescript
{cartItems.length === 0 && (
  <div className="text-center py-16">
    <ShoppingCart className="w-20 h-20 mx-auto mb-6" />
    <h1 className="text-3xl font-bold mb-4">Корзина пуста</h1>
    <Link href="/catalog">
      <Button>Перейти в каталог</Button>
    </Link>
  </div>
)}
```

### 4. Success State

```typescript
{orderComplete && (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <Check className="w-20 h-20 text-green-500" />
    <h1>Заказ оформлен!</h1>
    <p>Номер заказа: #{randomNumber}</p>
    <Button>Вернуться на главную</Button>
  </motion.div>
)}
```

### 5. Breadcrumbs

```typescript
<div className="flex items-center gap-2 text-sm">
  <Link href="/">Главная</Link>
  <ChevronRight />
  <Link href="/catalog">Каталог</Link>
  <ChevronRight />
  <span className="text-foreground">Корзина</span>
</div>
```

---

## 📦 Интеграция с реальной корзиной

### Вариант 1: Context API (простой)

```typescript
// contexts/CartContext.tsx
const CartContext = createContext<{
  items: CartItem[]
  addItem: (product: Product) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
}>(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState<CartItem[]>([])
  
  const addItem = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }
  
  // ... остальные методы
  
  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

// Использование
const { items, updateQuantity, removeItem } = useCart()
```

### Вариант 2: Zustand (рекомендуется)

```typescript
// stores/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CartState {
  items: CartItem[]
  addItem: (product: Product) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (product) => {
        const items = get().items
        const existing = items.find(item => item.id === product.id)
        
        if (existing) {
          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] })
        }
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          )
        })
      },
      
      removeItem: (id) => {
        set({ items: get().items.filter(item => item.id !== id) })
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => 
        get().items.reduce((sum, item) => sum + item.quantity, 0),
      
      getTotalPrice: () => 
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'cart-storage',  // Сохраняется в localStorage
    }
  )
)

// Использование
const items = useCartStore(state => state.items)
const addItem = useCartStore(state => state.addItem)
```

### Вариант 3: Redux Toolkit

```typescript
// store/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [] as CartItem[],
  },
  reducers: {
    addToCart: (state, action: PayloadAction<Product>) => {
      const existing = state.items.find(item => item.id === action.payload.id)
      if (existing) {
        existing.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id)
      if (item) {
        if (action.payload.quantity <= 0) {
          state.items = state.items.filter(item => item.id !== action.payload.id)
        } else {
          item.quantity = action.payload.quantity
        }
      }
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload)
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
```

---

## 🔒 Безопасность и валидация

### Валидация формы

```typescript
const [errors, setErrors] = useState<Record<string, string>>({})

const validateForm = () => {
  const newErrors: Record<string, string> = {}
  
  if (!formData.name.trim()) {
    newErrors.name = "Введите имя"
  }
  
  if (!formData.phone.match(/^\+7\s?\(\d{3}\)\s?\d{3}-\d{2}-\d{2}$/)) {
    newErrors.phone = "Неверный формат телефона"
  }
  
  if (!formData.address.trim()) {
    newErrors.address = "Введите адрес"
  }
  
  setErrors(newErrors)
  return Object.keys(newErrors).length === 0
}
```

### Защита от дублирования заказов

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  if (isSubmitting) return  // Предотвращаем двойной клик
  
  setIsSubmitting(true)
  
  try {
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cartItems,
        customer: formData,
        zone: selectedZone,
        payment: selectedPayment,
        total: total,
      }),
    })
    
    if (response.ok) {
      setOrderComplete(true)
      clearCart()
    }
  } catch (error) {
    console.error('Order error:', error)
  } finally {
    setIsSubmitting(false)
  }
}
```

---

## 📱 Отзывчивость (Responsive)

### Desktop (lg+)
```css
/* Двуколоночный макет */
grid-cols-[1fr_384px]
```

### Tablet (md)
```css
/* Одна колонка, но sidebar под формой */
flex-col
```

### Mobile
```css
/* Полностью вертикально */
flex-col
/* Упрощенная форма */
grid-cols-1
```

---

## ✅ Чеклист для новой корзины

### Перед началом:
- [ ] Выбрать способ хранения состояния (Context/Zustand/Redux)
- [ ] Определить зоны доставки и цены
- [ ] Определить способы оплаты
- [ ] Подготовить список промокодов

### Реализация:
- [ ] Создать `/app/cart/page.tsx`
- [ ] Настроить состояние корзины
- [ ] Реализовать управление товарами (+/-/удалить)
- [ ] Добавить выбор зоны доставки
- [ ] Реализовать расчёт доставки
- [ ] Добавить форму адреса
- [ ] Реализовать промокоды
- [ ] Добавить выбор способа оплаты
- [ ] Создать итоговый расчёт
- [ ] Реализовать отправку заказа

### UX улучшения:
- [ ] Empty state
- [ ] Success state
- [ ] Анимации (Framer Motion)
- [ ] Breadcrumbs
- [ ] Sticky sidebar
- [ ] Валидация формы
- [ ] Защита от дублирования

### Интеграция:
- [ ] Добавить кнопку "В корзину" в каталог
- [ ] Добавить счетчик товаров в навигацию
- [ ] Сохранение корзины в localStorage
- [ ] API для оформления заказа

---

## 🚀 Расширение функционала

### 1. Сохранение корзины

```typescript
// Автосохранение каждые 5 секунд
useEffect(() => {
  const interval = setInterval(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems))
  }, 5000)
  
  return () => clearInterval(interval)
}, [cartItems])

// Восстановление при загрузке
useEffect(() => {
  const saved = localStorage.getItem('cart')
  if (saved) {
    setCartItems(JSON.parse(saved))
  }
}, [])
```

### 2. Добавление в избранное

```typescript
const [favorites, setFavorites] = useState<number[]>([])

const toggleFavorite = (id: number) => {
  setFavorites(prev => 
    prev.includes(id) 
      ? prev.filter(fid => fid !== id)
      : [...prev, id]
  )
}
```

### 3. Рекомендации товаров

```typescript
// Показывать внизу страницы
const recommendations = useMemo(() => {
  return allProducts
    .filter(p => !cartItems.find(item => item.id === p.id))
    .slice(0, 4)
}, [cartItems])
```

### 4. Миникорзина в шапке

```typescript
// components/MiniCart.tsx
export function MiniCart() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, total } = useCart()
  
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <ShoppingCart />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {items.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        {/* Список товаров */}
        {/* Кнопка "Оформить" */}
      </PopoverContent>
    </Popover>
  )
}
```

---

## ❌ Чего НЕ делать

1. **Не хранить цены только на фронте** — всегда валидировать на бэкенде
2. **Не пропускать валидацию** — проверять все поля перед отправкой
3. **Не забывать про мобильную версию** — корзина должна быть удобной на телефоне
4. **Не делать перезагрузку страницы** — использовать SPA подход
5. **Не терять данные при обновлении** — сохранять в localStorage

---

## 📚 Полезные ссылки

- [Framer Motion Layout](https://www.framer.com/motion/layout-animations/)
- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [React Hook Form](https://react-hook-form.com/) — для сложной валидации
- [React Phone Input](https://www.npmjs.com/package/react-phone-input-2) — маска телефона

---

## ✅ Текущий статус (MicroGreen Shop)

**Реализовано:**
- ✅ Управление товарами (+/-/удалить)
- ✅ 4 зоны доставки с расчётом
- ✅ 3 способа оплаты (СБП, наличные, карта)
- ✅ Промокоды (GREEN10 = 10%)
- ✅ Форма адреса с валидацией
- ✅ Итоговый расчёт с доставкой
- ✅ Empty state
- ✅ Success state с номером заказа
- ✅ Анимации (Framer Motion)
- ✅ Breadcrumbs
- ✅ Sticky sidebar

**Дата создания:** 2026-02-16
**Версия:** 1.0
**Статус:** Production-ready

---

**💡 Запомни:** Эта корзина — универсальная и может быть адаптирована для любого e-commerce проекта на Next.js!
