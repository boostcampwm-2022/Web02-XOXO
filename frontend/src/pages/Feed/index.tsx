import React from 'react'
import './style.scss'
import FeedPostingList from '@src/components/FeedPostingList'
import FeedProfile from '@src/components/FeedProfile'
import Header from '@src/components/Header'

const MainPage = () => {
  // 테스트 데이터
  const feedInfo = { name: '부스트캠프 웹모바일 7기...' }
  return (
      <div className='feed-page'>
        <Header page='feed' text={feedInfo.name}/>
        <div className='feed-body'>
          <FeedProfile/>
          <FeedPostingList/>
        </div>
      </div>
  )
}

export default MainPage
