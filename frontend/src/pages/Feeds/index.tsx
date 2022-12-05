import React from 'react'
import './styles.scss'
import Header from '@src/components/Header'
import useSWR from 'swr'
import { Link } from 'react-router-dom'
import fetcher from '@src/util/fetcher'
import CreateFeedButton from './CreateFeedButton'

interface IFeed {
  id: string
  name: string
  thumbnail: string
}

const Feeds = () => {
  const { data: personalFeeds } = useSWR<IFeed[]>('/feed/list', fetcher)
  const { data: groupFeeds } = useSWR<IFeed[]>('/feed/group/list', fetcher)
  const feed = ({ id, name, thumbnail }: IFeed) => (
    <Link className="feeds-card" to={`/Feed/${id}`}>
      <div className="feeds-card-circle basic">
        <img src={thumbnail} alt="feedThumbnail" />
      </div>
      <span className="feeds-card-text basic">{name}</span>
    </Link>
  )
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
