import React, { useEffect, useRef } from 'react'
import './style.scss'
import { ImagePixelated } from 'react-pixelate'

interface propsInterface {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  imageSrc: string
}

const ThumbnailPreview = ({ isModalOpen, setModalOpen, imageSrc }: propsInterface) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const handleClickOutModal = (e: MouseEvent) => {
    if (modalRef.current === null || !isModalOpen) return
    if (!modalRef.current.contains(e.target as Node)) {
      setModalOpen(false)
    }
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutModal)
    return () => {
      document.removeEventListener('click', handleClickOutModal)
    }
  })
  return (
    <>
      <div className="dimd"></div>
      <div className="modal" ref={modalRef}>
        <div className="thumbnail-image">
          <ImagePixelated
            src={imageSrc}
            width={window.innerWidth * 0.15}
            height={window.innerWidth * 0.15}
            pixelSize={8}
            fillTransparencyColor={'#ffffff'}
          />
        </div>
      </div>
    </>
  )
}

export default ThumbnailPreview
