/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useSWR from 'swr'
import './style.scss'
import fetcher from '@util/fetcher'
import FeedPostingList from './FeedPostingList'
import FeedProfile from './FeedProfile'
import Header from '@components/Header'

interface IFeedInfo {
  name: string
  thumbnail: string
  description: string
  dueDate: string
  isOwner: boolean
  isGroupFeed: boolean
  postingCnt: number
}

const MainPage = () => {
  const navigate = useNavigate()
  const { feedId } = useParams<{ feedId: string }>()
  const { data: feedInfo, error: feedError } = useSWR<IFeedInfo>(feedId !== undefined ? `/feed/info/${feedId}` : null, fetcher)
  useEffect(() => {
    // 올바른 경로가 아니라면 에러를 404 페이지로 리다이렉트
    if (feedError) {
      console.log(feedError)
    }
  }, [feedError])
  useEffect(() => {
    // TODO - 그룹 피드의 일원이 아닐 경우 일단 404로 옮겨놨는데, 권한 없는 페이지 안내하는걸 만들지? 아니면 뒤로가기 시킬지 논의해봐야함
    if (feedInfo?.isGroupFeed && !feedInfo?.isOwner) navigate('/404')
  }, [feedInfo])
  return (
    <>
    {
      (feedInfo !== undefined)
        ? <div className="feed-page">
            <Header page="feed" text={feedInfo.name} />
            <div className="feed-body">
              <FeedProfile thumbnail={feedInfo.thumbnail} description={feedInfo.description} dueDate={feedInfo.dueDate} postingCnt={feedInfo.postingCnt} isOwner={feedInfo.isOwner} isGroupFeed={feedInfo.isGroupFeed}/>
              <FeedPostingList isOwner={feedInfo.isOwner} dueDate={feedInfo.dueDate} isGroupFeed={feedInfo.isGroupFeed}/>
            </div>
         </div>
        : null // TODO - 에러처리
    }
    </>
  )
}

export default MainPage
