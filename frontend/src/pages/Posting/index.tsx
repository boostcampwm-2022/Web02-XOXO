/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react'

import './styles.scss'
import Header from '@src/components/Header'
import defaultUserImage from '@assets/defaultUserImage.svg'
import useSWR from 'swr'
import { useParams } from 'react-router-dom'
import ImageSlider from './ImageSlider'
import fetcher from '@src/util/fetcher'

const Posting = () => {
  const { feedId, postingId } = useParams()
  const { data } = useSWR(`/posting/${feedId!}/${postingId!}`, fetcher)
  if (data === undefined) return <></>
  return (
    <div className="posting-page">
      <Header page="posting" text={data.feed.name} />
      <div className="posting-body">
        <div className="info-header">
          <div className="info-header-picture">
            <img
              src={data.sender.profile}
              onError={(e: any) => {
                e.target.src = defaultUserImage
              }}
            />
          </div>
          <span>{data.sender.nickname}</span>
        </div>
        <ImageSlider images={data.imageList} />
        <div className="letter-container">
          <span>{data.letter}</span>
        </div>
      </div>
    </div>
  )
}
export default Posting
