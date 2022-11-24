import React from 'react'
import './style.scss'
import { ReactComponent as ShareIcon } from '@assets/shareIcon.svg'
import { ReactComponent as EditIcon } from '@assets/editIcon.svg'
import DefaultUserImage from '@assets/defaultUserImage.svg'

const FeedProfile = () => {
  // 테스트 데이터
  const feedInfo = { name: '테스트', image: '', description: '가시밭길 위로 riding, you made me boost up (ah-ah-ah-ah) 거짓으로 가득 찬 party 가렵지도 않아 내 뒤에 말들이 많아', postingNum: 15, remainTime: '14일 4시간' }
  return (
    <div>
        <div className="feed-profile-header">
            <div className="feed-profile-image-wrapper">
                <div className="feed-profile-image">
                    <img src={feedInfo.image !== '' ? feedInfo.image : DefaultUserImage} alt="유저 프로필 이미지"/>
                </div>
                <div className="edit-button">
                    <EditIcon/>
                </div>
            </div>
            <div className="feed-profile-info-wrapper">
            <span className="feed-profile-description">
                {feedInfo.description}
            </span>
            <div className="feed-profile-status">
                <span className="feed-post-number">게시물 수 <span className="bold">{feedInfo.postingNum}</span></span>
                <span className="line"></span>
                <span className="feed-remaining-time">남은 시간 <span className="bold">{feedInfo.remainTime}</span></span>
            </div>
            </div>
            </div>
            <button className='feed-share-button'>
            <div>
                <ShareIcon/>
                <span>내 피드 공유하기</span>
            </div>
        </button>
    </div>
  )
}

export default FeedProfile
