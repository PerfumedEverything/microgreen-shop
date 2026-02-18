"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image, Copy, Check, Trash2, Link as LinkIcon, Loader2 } from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface UploadedImage {
  name: string
  url: string
  created_at: string
}

export default function MediaPage() {
  const [images, setImages] = useState<UploadedImage[]>([])
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createBrowserSupabaseClient()

  // Load existing images from Supabase Storage
  useEffect(() => {
    loadImages()
  }, [])

  const loadImages = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .list()
      
      if (error) {
        console.error('Error loading images:', error)
        setError('Ошибка при загрузке списка изображений')
        return
      }
      
      if (data) {
        const imageList = data
          .filter(file => !file.id.endsWith('/')) // Filter out folders
          .map(file => {
            const { data: { publicUrl } } = supabase.storage
              .from('product-images')
              .getPublicUrl(file.name)
            
            return {
              name: file.name,
              url: publicUrl,
              created_at: file.created_at,
            }
          })
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        
        setImages(imageList)
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Произошла ошибка при загрузке изображений')
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setError(null)

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Ошибка загрузки')
        }

        const data = await response.json()
        
        // Add new image to the list
        setImages(prev => [{
          name: data.filename,
          url: data.url,
          created_at: new Date().toISOString(),
        }, ...prev])
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Ошибка при загрузке файлов')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const copyUrl = (url: string, name: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(name)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const deleteImage = async (name: string) => {
    if (!confirm("Удалить изображение? Это действие нельзя отменить.")) return

    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Ошибка удаления')
      }

      // Remove from local state
      setImages(images.filter(img => img.name !== name))
    } catch (err: any) {
      console.error('Delete error:', err)
      setError(err.message || 'Ошибка при удалении файла')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Медиа</h2>
          <p className="text-gray-500 mt-1">Управление изображениями ({images.length})</p>
        </div>
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            multiple
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#16a34a] hover:bg-[#15803d] text-white"
            disabled={uploading}
          >
            {uploading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Загрузка...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Загрузить
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Info */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <Image className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Как использовать изображения</h4>
              <p className="text-sm text-blue-700 mt-1">
                1. Загрузите изображение (макс. 5MB, форматы: JPEG, PNG, WebP, GIF)<br/>
                2. Нажмите "Копировать URL"<br/>
                3. Вставьте URL при создании/редактировании товара
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#16a34a]" />
        </div>
      )}

      {/* Images Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image) => (
            <Card key={image.name} className="overflow-hidden group">
              <div className="relative aspect-square">
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyUrl(image.url, image.name)}
                    className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
                    title="Копировать URL"
                  >
                    {copiedId === image.name ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => deleteImage(image.name)}
                    className="p-2 bg-white rounded-lg hover:bg-red-50 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-xs text-gray-500 truncate">{image.name}</p>
                <button
                  onClick={() => copyUrl(image.url, image.name)}
                  className="text-xs text-[#16a34a] hover:underline mt-1 flex items-center gap-1"
                >
                  <LinkIcon className="w-3 h-3" />
                  {copiedId === image.name ? "Скопировано!" : "Копировать URL"}
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && images.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">Нет загруженных изображений</p>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 bg-[#16a34a] hover:bg-[#15803d] text-white"
          >
            <Upload className="w-4 h-4 mr-2" />
            Загрузить первое изображение
          </Button>
        </div>
      )}

      {/* External Images Note */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <h4 className="font-medium text-gray-900 mb-2">Использование внешних изображений</h4>
          <p className="text-sm text-gray-600">
            Вы также можете использовать прямые ссылки на изображения с Unsplash, Pexels и других сервисов. 
            Просто скопируйте URL изображения и вставьте в поле "URL изображения" при создании товара.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
