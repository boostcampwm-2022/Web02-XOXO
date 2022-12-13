import { canvasToFile } from '@src/util/canvasToFile'
import { cropImg } from '@src/util/cropImg'
import { compressImage } from '@src/util/imageCompress'
import React, { useEffect, useState } from 'react'
import { ImagePixelated } from './pixelate'

interface IPixelatedGenerator {
  imageFile: File
  setPixelatedFile: React.Dispatch<React.SetStateAction<File | undefined>>
}
const PixelatedGenerator = ({ imageFile, setPixelatedFile }: IPixelatedGenerator) => {
  const [croppedURL, setCroppedURL] = useState<string>('')
  useEffect(() => {
    void (async () => {
      const croppedCanvas = await cropImg(imageFile)
      const croppedFile = await canvasToFile(croppedCanvas)
      const compressedImage = await compressImage(croppedFile)
      setCroppedURL(URL.createObjectURL(compressedImage))
    })()
  }, [imageFile])
  useEffect(() => {
    if (croppedURL.length > 0) {
      console.log('cropped!', croppedURL)
      void (async () => {
        const pixelatedCanvas = document.querySelector('canvas') as HTMLCanvasElement
        const convertedFile = await canvasToFile(pixelatedCanvas)

        setPixelatedFile(convertedFile)
      })()
    }
  }, [croppedURL])

  return (
    <>
      <ImagePixelated
        src={croppedURL}
        width={240}
        height={240}
        pixelSize={12}
        centered={true}
        fillTransparencyColor={'#ffffff'}
        callbackFn={setPixelatedFile}
      />
    </>
  )
}

export default PixelatedGenerator
