import React, { useEffect, useRef } from 'react'
import './style.scss'

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
      URL.revokeObjectURL(imageSrc)
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
          <img src={imageSrc} style={{ width: window.innerWidth * 0.15, height: window.innerWidth * 0.15 }} />
        </div>
      </div>
    </>
  )
}

export default ThumbnailPreview
