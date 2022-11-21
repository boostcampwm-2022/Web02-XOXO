import React, { useEffect, useRef } from 'react'
import './style.scss'

interface propsInterface {
  isModalOpen: Boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ThumbnailPreview = ({ isModalOpen, setModalOpen }: propsInterface) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const handleClickOutModal = (e: MouseEvent) => {
    if (modalRef.current === null || isModalOpen === false) return
    if (!modalRef.current.contains(e.target as Node)) {
      console.log('handleClickOutModal')
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
    <div className='dimd'></div>
    <div className='modal' ref={modalRef}>
        <div className="thumbnail-image">
        </div>
    </div>
    </>
  )
}

export default ThumbnailPreview
