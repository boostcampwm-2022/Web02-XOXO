import { canvasToFile } from '@src/util/canvasToFile'

export const pixelateCanvas = async (canvas: HTMLCanvasElement): Promise<File> => {
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
  const width = canvas.width
  const height = canvas.height
  const pixelSize = Math.floor(width / 20)
  const fillTransparencyColor = '#ffffff'
  for (let x = 0; x < width + pixelSize; x += pixelSize) {
    for (let y = 0; y < height + pixelSize; y += pixelSize) {
      let xColorPick = x
      let yColorPick = y

      if (x >= width) {
        xColorPick = x - (pixelSize - (width % pixelSize) / 2) + 1
      }
      if (y >= height) {
        yColorPick = y - (pixelSize - (height % pixelSize) / 2) + 1
      }

      const rgba = ctx.getImageData(xColorPick, yColorPick, 1, 1).data
      ctx.fillStyle = rgba[3] === 0 ? fillTransparencyColor : `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`
      ctx.fillRect(
        Math.floor(x - (pixelSize - (width % pixelSize) / 2)),
        Math.floor(y - (pixelSize - (height % pixelSize) / 2)),
        pixelSize,
        pixelSize
      )
    }
  }
  const pixelatedFile = await canvasToFile(canvas)
  return pixelatedFile
}
