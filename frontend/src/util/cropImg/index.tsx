export const cropImg = async (file: File) => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  const img = await loadImage(file)
  const ctx = canvas?.getContext('2d')
  const { width, height } = img
  const sx = width >= height ? (width - height) / 2 : 0
  const sy = width <= height ? (height - width) / 2 : 0
  const min = Math.min(width, height)
  canvas.width = min
  canvas.height = min

  ctx?.drawImage(img, sx, sy, min, min, 0, 0, min, min)
  return canvas
}
const loadImage = (file: File) => {
  const img = document.createElement('img') as HTMLImageElement
  const src = URL.createObjectURL(file)
  img.src = src
  return new Promise<HTMLImageElement>((resolve) => {
    img.onload = () => {
      URL.revokeObjectURL(src)
      resolve(img)
    }
  })
}
