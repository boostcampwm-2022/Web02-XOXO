/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import './style.scss'
import { ReactComponent as ShareIcon } from '@assets/shareIcon.svg'
import DefaultUserImage from '@assets/defaultUserImage.svg'
import { getFeedThumbUrl } from '@util/imageQuery'
import { remainDueDate } from '@util/index'
import { isFutureRatherThanServer } from '@util/validation/bool'
import fetcher from '@util/fetcher'

interface IProps {
  name: string
  thumbnail: string
  description: string
  dueDate: string
  isOwner: boolean
  isGroupFeed: boolean
  postingCnt: number
}

const FeedProfile = ({ name, thumbnail, description, dueDate, postingCnt, isOwner, isGroupFeed }: IProps) => {
  const { data: serverDate } = useSWR('/serverTime', fetcher)
  const { feedId } = useParams<{ feedId: string }>()
  const kakaoJavascriptKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY
  const kakaoMessageTemplate = Number(process.env.REACT_APP_KAKAO_MESSAGE_TEMPLATE)
  useEffect(() => {
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoJavascriptKey)
    }
  }, [kakaoJavascriptKey])
  const sendKakaoMessage = () => {
    window.Kakao.Share.sendCustom({
      templateId: kakaoMessageTemplate,
      templateArgs: {
        feedUrl: `Feed/${feedId}`
      }
    })
  }
  return (
    <div>
      <div className="feed-profile-header-wrapper">
        <div className="feed-profile-header">
          <div className="feed-profile-image-wrapper">
            <div className="feed-profile-image">
              <img src={thumbnail !== '' ? getFeedThumbUrl(thumbnail) : DefaultUserImage} alt="유저 프로필 이미지" />
            </div>
          </div>
          <div className="feed-profile-info-wrapper">
            <span className="feed-profile-name">{name}</span>
            <span className="feed-profile-description">{description}</span>
            <div className="feed-profile-status">
              <span className="feed-post-number">
                게시물 수 <span className="bold">{postingCnt}</span>
              </span>
              <span className="line"></span>
              <span className="feed-remaining-time">
                남은 시간
                <span className="bold">
                  {!isFutureRatherThanServer(dueDate, serverDate) ? ' 없음' : ` ${remainDueDate(dueDate, serverDate)}`}
                </span>
              </span>
            </div>
          </div>
        </div>
        {isOwner && (
          <button className="feed-share-button" onClick={sendKakaoMessage}>
            <div>
              <ShareIcon />
              <span>피드 공유하기</span>
            </div>
          </button>
        )}
      </div>
    </div>
  )
}

export default FeedProfile
