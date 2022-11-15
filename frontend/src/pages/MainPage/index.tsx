import React from 'react'
import './style.scss'
import { ReactComponent as ShareIcon } from '@assets/shareIcon.svg'
import { ReactComponent as DownIcon } from '@assets/downIcon.svg'
import { ReactComponent as LogoutIcon } from '@assets/logoutIcon.svg'

const MainPage = () => {
  return (
      <div className='main-page'>
        <div className='main-header'>
          부스트캠프 웹모바일 7기...
          <DownIcon/>
          <LogoutIcon/>
        </div>
        <div className='main-body'>
          <div className="main-header">
            <div className="feed-image-wrapper">
              <div className="feed-image"></div>
              <div className="edit-button"></div>
            </div>
            <div className="feed-description"></div>
            <div className="feed-status">
              <div className="feed-post-number"></div>
              <div className="line"></div>
              <div className="feed-remaining-time"></div>
            </div>
          </div>
          <button className='feed-share-button'>
              <div>
                <ShareIcon/>
                <span>내 피드 공유하기</span>
              </div>
          </button>
        </div>
      </div>
  )
}

export default MainPage
