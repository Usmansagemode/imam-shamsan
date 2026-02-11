export interface GalleryImage {
  id: string
  caption: string
  imageUrl: string
  category: string
  order: number
  featured: boolean
  status: 'Active' | 'Inactive'
}
