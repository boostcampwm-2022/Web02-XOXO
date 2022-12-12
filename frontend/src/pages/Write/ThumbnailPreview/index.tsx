import { canvasToFile } from '@src/util/canvasToFile'
import { cropImg } from '@src/util/cropImg'
import { isEmpty } from 'lodash'
import React, { useEffect, useRef, useState } from 'react'
import { ImagePixelated } from 'react-pixelate'
import './style.scss'

interface propsInterface {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  imageFile: File
  setPixelatedFile: React.Dispatch<React.SetStateAction<File | undefined>>
}

const ThumbnailPreview = ({ isModalOpen, setModalOpen, imageFile, setPixelatedFile }: propsInterface) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [croppedURL, setCroppedURL] = useState('')
  const [imageSrc, setImageSrc] = useState('')
  const handleClickOutModal = (e: MouseEvent) => {
    if (modalRef.current === null || !isModalOpen) return
    if (!modalRef.current.contains(e.target as Node)) {
      URL.revokeObjectURL(imageSrc)
      setModalOpen(false)
    }
  }
  const generatePixelatedFile = async (): Promise<File> => {
    const url = await cropImg(imageFile)
    setCroppedURL(url)
    const pixelatedCanvas = document.querySelector('canvas') as HTMLCanvasElement
    const pixelatedFile = await canvasToFile(pixelatedCanvas)
    setPixelatedFile(pixelatedFile)
    return pixelatedFile
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutModal)
    void (async () => {
      const pixelatedFile = await generatePixelatedFile()
      setImageSrc(URL.createObjectURL(pixelatedFile))
    })
    return () => {
      document.removeEventListener('click', handleClickOutModal)
    }
  })
  return (
    <>
      <div className="dimd"></div>
      <div className="modal" ref={modalRef}>
        <div className="thumbnail-image">
          <img
            src={imageSrc}
            onLoad={() => {
              URL.revokeObjectURL(imageSrc)
            }}
            style={{ width: window.innerWidth * 0.15, height: window.innerWidth * 0.15 }}
          />
        </div>
      </div>
      {!isEmpty(croppedURL) && (
        <ImagePixelated
          src={croppedURL}
          width={240}
          height={240}
          pixelSize={12}
          centered={true}
          fillTransparencyColor={'#ffffff'}
        />
      )}
    </>
  )
}

export default ThumbnailPreview
