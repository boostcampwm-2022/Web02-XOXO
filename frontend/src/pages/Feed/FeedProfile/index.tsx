/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect } from 'react'
import './style.scss'
import { ReactComponent as ShareIcon } from '@assets/shareIcon.svg'
import { ReactComponent as EditIcon } from '@assets/editIcon.svg'
import DefaultUserImage from '@assets/defaultUserImage.svg'
import { remainDueDate } from '@util/index'

interface IProps {
  thumbnail: string
  description: string
  dueDate: string
  isOwner: boolean
  isGroupFeed: boolean
  postingCnt: number
}

const FeedProfile = ({ thumbnail, description, dueDate, postingCnt, isOwner, isGroupFeed }: IProps) => {
  const kakaoJavascriptKey = process.env.REACT_APP_KAKAO_JAVASCRIPT_KEY
  const kakaoMessageTemplate = Number(process.env.REACT_APP_KAKAO_MESSAGE_TEMPLATE)
  useEffect(() => {
    if (!(window.Kakao.isInitialized())) {
      window.Kakao.init(kakaoJavascriptKey)
    }
  }, [])
  const sendKakaoMessage = () => {
    window.Kakao.Share.sendCustom({
      templateId: kakaoMessageTemplate
    })
  }
  return (
    <div>
        <div className="feed-profile-header">
            <div className="feed-profile-image-wrapper">
                <div className="feed-profile-image">
                    <img src={thumbnail !== '' ? thumbnail : DefaultUserImage} alt="유저 프로필 이미지"/>
                </div>
                <div className="edit-button">
                    <EditIcon/>
                </div>
            </div>
            <div className="feed-profile-info-wrapper">
                <span className="feed-profile-description">
                    {description}
                </span>
                <div className="feed-profile-status">
                    <span className="feed-post-number">게시물 수 <span className="bold">{postingCnt}</span></span>
                    <span className="line"></span>
                    <span className="feed-remaining-time">남은 시간 <span className="bold">{remainDueDate(dueDate)}</span></span>
                </div>
            </div>
        </div>
        {
          !isGroupFeed && isOwner && <button className='feed-share-button' onClick={sendKakaoMessage}>
            <div>
                <ShareIcon/>
                <span>내 피드 공유하기</span>
            </div>
          </button>
        }
    </div>
  )
}

export default FeedProfile
