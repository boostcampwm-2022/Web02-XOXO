import React, { useEffect } from 'react'
import './styles.scss'
import Header from '@src/components/Header'
import useSWR from 'swr'
import { Link, Navigate } from 'react-router-dom'
import fetcher from '@src/util/fetcher'
import { getFeedsThumbUrl } from '@util/imageQuery'
import CreateFeedButton from './CreateFeedButton'

interface IFeed {
  encryptedId: string
  name: string
  thumbnail: string
}

const Feeds = () => {
  const { data: personalFeeds } = useSWR('/feed/list', fetcher)
  const { data: groupFeeds } = useSWR('/feed/group/list', fetcher)
  useEffect(() => {
    console.log(personalFeeds)
  }, [personalFeeds])
  const feed = ({ encryptedId, name, thumbnail }: IFeed) => (
    <Link className="feeds-card" to={`/Feed/${encryptedId}`} key={encryptedId}>
      <div className="feeds-card-circle basic">
        <img src={getFeedsThumbUrl(thumbnail)} alt="feedThumbnail" />
      </div>
      <span className="feeds-card-text basic">{name}</span>
    </Link>
  )
  if (window.localStorage.getItem('feedId') !== null) {
    return <Navigate to={`/Feed/${window.localStorage.getItem('feedId')!}`} />
  }
  return (
    <div className="feeds-page">
      <Header page="feeds" text={'내 피드'} />
      <div className="feeds-body">
        <span className="feeds-title">개인</span>
        <div className="feeds-list">
          <CreateFeedButton to="/Createfeed/personal" text="새 개인 피드 추가하기" />
          {personalFeeds?.map(feed)}
        </div>
        <span className="feeds-title">그룹</span>
        <div className="feeds-list">
          <CreateFeedButton to="/Createfeed/group" text="새 그룹 피드 추가하기" />
          {groupFeeds?.map(feed)}
        </div>
      </div>
    </div>
  )
}

export default Feeds
