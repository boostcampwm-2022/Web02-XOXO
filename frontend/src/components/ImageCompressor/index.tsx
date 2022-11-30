import React, { useRef } from 'react'

interface IImageCompressor {
  file: File
  setFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

const ImageCompressor = ({ file, setFile }: IImageCompressor) => {
  const canvas = useRef<HTMLCanvasElement>(null)

  const BASE_SIZE = 1024000
  const COMP_SIZE = 102400
  const image = new Image()
  image.src = URL.createObjectURL(file)
  let width = image.width
  let height = image.height
  const size = file.size
  const fileName = file.name

  if (size <= BASE_SIZE) setFile(file)
  else {
    const ratio = Math.ceil(Math.sqrt(size / COMP_SIZE))
    width = image.width / ratio
    height = image.height / ratio
    if (canvas.current !== null) {
      canvas.current.width = width
      canvas.current.height = height
      const ctx = canvas.current.getContext('2d')
      ctx?.drawImage(image, 0, 0, width, height)
      const dataURI = canvas.current.toDataURL('image/png')
      const byteString = atob(dataURI.split(',')[1])
      const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
      const ab = new ArrayBuffer(byteString.length)
      const ia = new Uint8Array(ab)
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
      }
      const tmpThumbFile = new File([ab], fileName, { type: mimeString })
      console.log('컴', tmpThumbFile)

      setFile(tmpThumbFile)
    }
  }

  return (
    <>
      <canvas ref={canvas}></canvas>
    </>
  )
}

export default ImageCompressor
