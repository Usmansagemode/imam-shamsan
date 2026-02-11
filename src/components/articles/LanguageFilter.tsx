import { cn } from '@/lib/utils'

interface LanguageFilterProps {
  selected: string
  onSelect: (value: string) => void
  categories?: string[]
  selectedCategory?: string
  onCategorySelect?: (value: string) => void
}

const languages = ['All', 'English', 'Arabic', 'Bilingual']

export function LanguageFilter({
  selected,
  onSelect,
  categories,
  selectedCategory,
  onCategorySelect,
}: LanguageFilterProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-muted-foreground self-center mr-1">
          Language:
        </span>
        {languages.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={cn(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
              selected === lang
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {lang}
          </button>
        ))}
      </div>

      {categories && categories.length > 0 && onCategorySelect && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-muted-foreground self-center mr-1">
            Category:
          </span>
          {['All', ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                selectedCategory === cat
                  ? 'bg-secondary text-secondary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
