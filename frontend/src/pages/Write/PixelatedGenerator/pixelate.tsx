/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { canvasToFile } from '@src/util/canvasToFile'
import { isEmpty } from 'lodash'
import React, { useRef, useEffect } from 'react'

export type ImagePixelatedProps = {
  src: string
  width: number
  height: number
  pixelSize: number
  centered: boolean
  fillTransparencyColor: string
  callbackFn: React.Dispatch<React.SetStateAction<File | undefined>>
}

export const ImagePixelated = ({
  src,
  width,
  height,
  pixelSize = 5,
  centered,
  fillTransparencyColor,
  callbackFn
}: ImagePixelatedProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    pixelate({
      src,
      width,
      height,
      pixelSize,
      centered,
      fillTransparencyColor,
      callbackFn
    })
  }, [src, width, height, pixelSize, centered, fillTransparencyColor])
  const pixelate = ({
    src,
    width,
    height,
    pixelSize,
    centered,
    fillTransparencyColor,
    callbackFn
  }: ImagePixelatedProps) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = async () => {
      if (isEmpty(canvasRef.current)) return
      const canvas: HTMLCanvasElement = canvasRef!.current
      if (canvas) {
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
        img.width = width || img.width
        img.height = height || img.height
        canvas.width = img.width
        canvas.height = img.height

        ctx.drawImage(img, 0, 0, img.width, img.height)
        paintPixels(ctx, img, pixelSize, centered, fillTransparencyColor)
        const pixelatedFile = await canvasToFile(canvas)
        callbackFn(pixelatedFile)
      }
    }
  }
  const paintPixels = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    pixelSize: number,
    centered: boolean,
    fillTransparencyColor: string
  ) => {
    if (!isNaN(pixelSize) && pixelSize > 0) {
      for (let x = 0; x < img.width + pixelSize; x += pixelSize) {
        for (let y = 0; y < img.height + pixelSize; y += pixelSize) {
          let xColorPick = x
          let yColorPick = y

          if (x >= img.width) {
            xColorPick = x - (pixelSize - (img.width % pixelSize) / 2) + 1
          }
          if (y >= img.height) {
            yColorPick = y - (pixelSize - (img.height % pixelSize) / 2) + 1
          }

          const rgba = ctx.getImageData(xColorPick, yColorPick, 1, 1).data
          ctx.fillStyle = rgba[3] === 0 ? fillTransparencyColor : `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`

          if (centered) {
            ctx.fillRect(
              Math.floor(x - (pixelSize - (img.width % pixelSize) / 2)),
              Math.floor(y - (pixelSize - (img.height % pixelSize) / 2)),
              pixelSize,
              pixelSize
            )
          } else {
            ctx.fillRect(x, y, pixelSize, pixelSize)
          }
        }
      }
    }
  }
  return <canvas ref={canvasRef} />
}
