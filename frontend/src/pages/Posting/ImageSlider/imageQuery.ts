export const getthumbUrl = (url: string) => {
  return `${url}${getQueryString(true)}`
}
export const getoriginalUrl = (url: string) => {
  return `${url}${getQueryString(false)}`
}
const getQueryString = (isLq: boolean) => {
  const windowWidth = window.innerWidth
  const size = isLq ? getThumbSize(windowWidth) : getOriginalSize(windowWidth)
  return `?type=m&w=${size}&h=${size}`
}
const getOriginalSize = (widdowWidth: number) => {
  const level = Math.floor(widdowWidth / 100)
  if (level >= 5) return 500
  if (level >= 4) return 400
  return 300
}
const getThumbSize = (widdowWidth: number) => {
  const level = Math.floor(widdowWidth / 100)
  if (level >= 5) return 50
  if (level >= 4) return 40
  return 30
}
