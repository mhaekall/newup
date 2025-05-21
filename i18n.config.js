export const defaultLocale = "en"
export const locales = ["en", "id"]

export function getLocalePartsFrom(path) {
  const pathWithoutQuery = path.split("?")[0]
  const pathParts = pathWithoutQuery.split("/")
  const locale = pathParts[1]

  if (locales.includes(locale)) {
    return {
      locale,
      pathWithoutLocale: pathParts.slice(2).join("/") || "/",
    }
  }

  return {
    locale: defaultLocale,
    pathWithoutLocale: path,
  }
}
