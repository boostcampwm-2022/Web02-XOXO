import React, { useEffect, useRef, useState } from 'react'
import './style.scss'

interface propsInterface {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  imageFile: File
}

const ThumbnailPreview = ({ isModalOpen, setModalOpen, imageFile }: propsInterface) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [imageSrc, setImageSrc] = useState('')
  const handleClickOutModal = (e: MouseEvent) => {
    if (modalRef.current === null || !isModalOpen) return
    if (!modalRef.current.contains(e.target as Node)) {
      setModalOpen(false)
    }
  }

  useEffect(() => {
    setImageSrc(URL.createObjectURL(imageFile))
  }, [imageFile])

  useEffect(() => {
    document.addEventListener('click', handleClickOutModal)
    return () => {
      document.removeEventListener('click', handleClickOutModal)
    }
  }, [])
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
          />
        </div>
      </div>
    </>
  )
}

export default ThumbnailPreview
