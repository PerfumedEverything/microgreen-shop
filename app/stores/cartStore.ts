import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: number
  name: string
  price: number
  weight: string
  image: string
  quantity: number
}

export interface RemovedItem extends CartItem {
  removedAt: number
}

interface CartState {
  items: CartItem[]
  recentlyRemoved: RemovedItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  updateQuantity: (id: number, quantity: number) => void
  removeItem: (id: number) => void
  restoreItem: (id: number) => void
  clearRecentlyRemoved: () => void
  clearCart: () => void
  getItemQuantity: (id: number) => number
  getTotalItems: () => number
  getTotalPrice: () => number
  isInCart: (id: number) => boolean
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      recentlyRemoved: [],

      addItem: (item) => {
        const items = get().items
        const existingItem = items.find((i) => i.id === item.id)

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] })
        }

        // Clear from recently removed if it was there
        set({
          recentlyRemoved: get().recentlyRemoved.filter((i) => i.id !== item.id),
        })
      },

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }

        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id)
        if (item) {
          const removedItem: RemovedItem = { ...item, removedAt: Date.now() }
          set({
            items: get().items.filter((i) => i.id !== id),
            recentlyRemoved: [removedItem, ...get().recentlyRemoved].slice(0, 5), // Keep last 5
          })

          // Auto clear after 10 seconds
          setTimeout(() => {
            set({
              recentlyRemoved: get().recentlyRemoved.filter(
                (i) => !(i.id === id && i.removedAt === removedItem.removedAt)
              ),
            })
          }, 10000)
        }
      },

      restoreItem: (id) => {
        const removedItem = get().recentlyRemoved.find((i) => i.id === id)
        if (removedItem) {
          const { removedAt, ...item } = removedItem
          set({
            items: [...get().items, item],
            recentlyRemoved: get().recentlyRemoved.filter((i) => i.id !== id),
          })
        }
      },

      clearRecentlyRemoved: () => set({ recentlyRemoved: [] }),

      clearCart: () => set({ items: [], recentlyRemoved: [] }),

      getItemQuantity: (id) => {
        const item = get().items.find((i) => i.id === id)
        return item?.quantity || 0
      },

      getTotalItems: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getTotalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

      isInCart: (id) => get().items.some((i) => i.id === id),
    }),
    {
      name: 'microgreen-cart',
      partialize: (state) => ({ items: state.items }), // Don't persist recentlyRemoved
    }
  )
)
