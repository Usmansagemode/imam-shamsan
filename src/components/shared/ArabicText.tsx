import { cn } from '@/lib/utils'

interface ArabicTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode
  as?: 'span' | 'p' | 'div' | 'h1' | 'h2' | 'h3'
}

export function ArabicText({
  children,
  as: Tag = 'span',
  className,
  ...props
}: ArabicTextProps) {
  return (
    <Tag
      dir="rtl"
      lang="ar"
      className={cn('font-arabic', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}
