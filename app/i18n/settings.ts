export const defaultLocale = "en"
export const locales = ["en", "id"]

export type Locale = (typeof locales)[number]

export const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  id: () => import("./dictionaries/id.json").then((module) => module.default),
}
