import React from 'react'

import './styles.scss'
import Header from '@src/components/Header'
import defaultUserImage from '@assets/defaultUserImage.svg'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import ImageSlider from './ImageSlider'
const Posting = () => {
  const { feedId, postingId } = useParams()
  const {
    data: {
      name,
      letter,
      imageList: images,
      sender: { nickname, thumbnail }
    }
  } = useSWR(`/posting/${feedId!}/${postingId!}`)

  return (
    <div className="posting-page">
      <Header page="posting" text={name} />
      <div className="posting-body">
        <div className="info-header">
          <div className="info-header-picture">
            <img
              src={thumbnail}
              onError={(e: any) => {
                e.target.src = defaultUserImage
              }}
            />
          </div>
          <span>{nickname}</span>
        </div>
        <ImageSlider images={images} />
        <div className="letter-container">
          <span>{letter}</span>
        </div>
      </div>
    </div>
  )
}
export default Posting
