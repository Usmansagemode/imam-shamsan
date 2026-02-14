export interface SiteSettingEntry {
  value: string
  updatedAt: string
}

export type SiteSettings = Record<string, SiteSettingEntry>
