import { Dispatch, SetStateAction } from 'react'

export const cropImg = (file: File, setCroppedURL: Dispatch<SetStateAction<string>>) => {
  const img = document.createElement('img') as HTMLImageElement
  const canvas = document.createElement('canvas') as HTMLCanvasElement
  const ctx = canvas?.getContext('2d')
  const src = URL.createObjectURL(file!)
  img.src = src
  img.onload = () => {
    const { width, height } = img
    const sx = width >= height ? (width - height) / 2 : 0
    const sy = width <= height ? (height - width) / 2 : 0
    const min = Math.min(width, height)
    canvas.width = min
    canvas.height = min

    ctx?.drawImage(img, sx, sy, min, min, 0, 0, min, min)
    URL.revokeObjectURL(src)
    setCroppedURL(canvas.toDataURL())
  }
}
