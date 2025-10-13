import { useAppStore } from "@/lib/store"
import { translations } from "@/lib/i18n"

export function useTranslation() {
  const language = useAppStore((state) => state.language)

  const t = (key: keyof typeof translations.vi) => {
    return translations[language][key] || key
  }

  return { t, language }
}
