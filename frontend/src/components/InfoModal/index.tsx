import React, { useEffect, useRef } from 'react'
import './style.scss'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import useSWR from 'swr'
import { isEmpty } from 'lodash'

interface propsInterface {
  isModalOpen: boolean
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const InfoModal = ({ isModalOpen, setModalOpen }: propsInterface) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const { data: imageSrcs } = useSWR<string[]>('/info', () => {
    return [
      'https://i.pinimg.com/236x/b3/a6/5c/b3a65cf514632978e339ff2b328e791f.jpg',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6J961o59KiArFpJpyHKc_pLoIF9jEJUOZzA&usqp=CAU',
      'http://img.segye.com/content/image/2021/02/24/20210224504395.jpg'
    ]
  })
  const handleClickOutModal = (e: MouseEvent) => {
    if (modalRef.current === null || !isModalOpen) return
    if (!modalRef.current.contains(e.target as Node)) {
      setModalOpen(false)
    }
  }
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true
  }
  const imageCards = imageSrcs?.map((src, index) => (
    <div className="info-container" key={index}>
      <img src={src} alt={`${index + 1}번째 이미지`}></img>
    </div>
  ))
  useEffect(() => {
    document.addEventListener('click', handleClickOutModal)
    return () => {
      document.removeEventListener('click', handleClickOutModal)
    }
  }, [])
  return (
    <>
      <div className="dimd"></div>
      <div className="info-modal" ref={modalRef}>
        <Slider {...settings}>{!isEmpty(imageSrcs) && imageCards}</Slider>
      </div>
    </>
  )
}

export default InfoModal
