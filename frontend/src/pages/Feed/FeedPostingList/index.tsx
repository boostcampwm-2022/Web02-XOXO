import React from 'react'
import { Link } from 'react-router-dom'
import './style.scss'

const FeedPostingList = () => {
  // 테스트 데이터
  const postings = [
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 0 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 1 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 2 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 3 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 4 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 },
    { thumbnailUrl: 'https://source.unsplash.com/random', postingId: 5 }
  ]
  const postingList = postings.map((posting) => (
    <Link key={posting.postingId} className="posting-container" to="/posting">
      <div
        className="posting"
        style={{ backgroundImage: `url(${posting.thumbnailUrl})`, backgroundSize: 'cover' }}
      ></div>
    </Link>
  ))
  return (
    <div>
      <div className="posting-grid">{postingList}</div>
    </div>
  )
}

export default FeedPostingList
