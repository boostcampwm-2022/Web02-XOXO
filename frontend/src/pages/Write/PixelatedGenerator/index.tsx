import { cropImg } from '@src/util/cropImg'
import React, { useEffect, useState } from 'react'
import { ImagePixelated } from 'react-pixelate'

interface IPixelatedGenerator {
  imageFile: File
  setPixelatedFile: React.Dispatch<React.SetStateAction<File | undefined>>
}
const PixelatedGenerator = ({ imageFile, setPixelatedFile }: IPixelatedGenerator) => {
  const [croppedURL, setCroppedURL] = useState<string>('')
  useEffect(() => {
    void (async () => {
      const url = await cropImg(imageFile)
      setCroppedURL(url)
      const pixelatedCanvas = document.querySelector('canvas') as HTMLCanvasElement
      pixelatedCanvas.toBlob(
        (blob) => {
          const convertedFile = new File([blob as BlobPart], 'name.jpeg', { type: 'image/jpeg' })
          setPixelatedFile(convertedFile)
        },
        'image/jpeg',
        100
      )
    })()
  }, [imageFile, croppedURL])
  return (
    <ImagePixelated
      src={croppedURL}
      width={240}
      height={240}
      pixelSize={12}
      centered={true}
      fillTransparencyColor={'#ffffff'}
    />
  )
}

export default PixelatedGenerator
