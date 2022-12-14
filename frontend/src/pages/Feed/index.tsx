/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React from 'react'
import { useParams } from 'react-router-dom'
import useSWR from 'swr'
import './style.scss'
import fetcher from '@util/fetcher'
import FeedPostingList from './FeedPostingList'
import FeedProfile from './FeedProfile'
import Header from '@components/Header'
import Error from '../Error'

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
  const { feedId } = useParams<{ feedId: string }>()
  const { data: feedInfo, error: feedError } = useSWR<IFeedInfo>(
    feedId !== undefined ? `/feed/info/${feedId}` : null,
    fetcher
  )

  // 올바른 경로가 아닐 때 (feed 정보를 불러오는데에 실패 했을 때)
  if (feedError !== undefined) {
    return <Error />
  }

  // 그룹 피드의 주인이 아닐 때
  if (feedInfo?.isGroupFeed && !feedInfo.isOwner) {
    return <Error />
  }

  return (
    <>
      {
        feedInfo !== undefined ? (
          <div className="feed-page">
            <Header page="feed" />
            <div className="feed-body">
              <FeedProfile
                name={feedInfo.name}
                thumbnail={feedInfo.thumbnail}
                description={feedInfo.description}
                dueDate={feedInfo.dueDate}
                postingCnt={feedInfo.postingCnt}
                isOwner={feedInfo.isOwner}
                isGroupFeed={feedInfo.isGroupFeed}
              />
              <FeedPostingList
                isOwner={feedInfo.isOwner}
                dueDate={feedInfo.dueDate}
                isGroupFeed={feedInfo.isGroupFeed}
              />
            </div>
          </div>
        ) : null // TODO - 에러처리
      }
    </>
  )
}

export default MainPage
