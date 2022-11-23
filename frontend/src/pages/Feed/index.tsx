import React, { useEffect } from 'react'
import './style.scss'
import FeedPostingList from './FeedPostingList'
import FeedProfile from './FeedProfile'
import Header from '@components/Header'
import { toast } from 'react-toastify'
import Toast from '@src/components/Toast'

const MainPage = () => {
  useEffect(() => {
    toast('게시물이 공개되기까지 14일 4시간 남았어요')
  }, [])
  const feedInfo = { name: '부스트캠프 웹모바일 7기...' }
  return (
    <div className="feed-page">
      <Header page="feed" text={feedInfo.name} />
      <div className="feed-body">
        <FeedProfile />
        <FeedPostingList />
        <Toast />
      </div>
    </div>
  )
}

export default MainPage
