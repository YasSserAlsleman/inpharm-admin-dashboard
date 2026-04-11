export function getLocalizedValue(item, field, lang) {
  if (!item) return ''

  const valueByLang = item[`${field}_${lang}`]
  if (valueByLang !== undefined && valueByLang !== null && valueByLang !== '') {
    return valueByLang
  }

  const fallback = item[field] || item[`${field}_en`] || item[`${field}_ar`] || item[`${field}_de`] || ''
  return fallback
}
