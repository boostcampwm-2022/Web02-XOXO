/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSWRInfinite from 'swr/infinite'
import { toast } from 'react-toastify'
import Toast from '@components/Toast'
import { ReactComponent as PlusIcon } from '@assets/plusIcon.svg'
import useInfiniteScroll from '@hooks/useInfiniteScroll'
import { isFuture } from '@util/validation/bool'
import { remainDueDate } from '@util/index'
import fetcher from '@util/fetcher'
import ObserverElement from './ObserverElement'
import Loading from './Loading'
import './style.scss'

interface Iposting {
  id: string
  thumbanil: string
}
interface IProps {
  isOwner: boolean
  dueDate: string
  isGroupFeed: boolean
}
const SCROLL_SIZE = 15

const FeedPostingList = ({ isOwner, dueDate, isGroupFeed }: IProps) => {
  const { feedId } = useParams<{ feedId: string }>()
  const navigate = useNavigate()
  const getKey = (pageIndex: number, previousPageData: Iposting[]) => {
    if (previousPageData && !previousPageData.length) return null
    if (pageIndex === 0) return `/feed/scroll/${feedId}?size=${SCROLL_SIZE}&index=${pageIndex}`
    return `/feed/scroll/${feedId}?size=${SCROLL_SIZE}&index=${previousPageData[previousPageData.length - 1].id}`
  }
  const { data: postings, error, size, setSize } = useSWRInfinite(getKey, fetcher, { initialSize: 1, revalidateFirstPage: false })
  // 리스트 로딩중일 때
  const isLoading = (!postings && !error) || (size > 0 && postings && typeof postings[size - 1] === 'undefined')
  // 리스트를 정상적으로 받아왔지만 비어있을 경우 (게시글이 작성되지 않았을 경우)
  const isEmpty = postings?.[0]?.length === 0
  // 리스트를 끝까지 읽었을 경우
  const isReachingEnd = (postings != null) && postings[postings.length - 1]?.length < SCROLL_SIZE
  const bottomElement = useInfiniteScroll(postings, () => {
    !isReachingEnd && setSize(size => size + 1)
  })
  const checkDueDate = (id: string) => {
    // TODO - 현재는 그냥 클라이언트 상에서 확인하지만, 서버 시간을 확인해서 진행할지? 논의 진행해야함
    isFuture(dueDate) ? toast(`게시물이 공개되기까지 ${remainDueDate(dueDate)} 남았어요`) : navigate(`${id}`)
  }
  const postingList = postings?.flat().map((posting: Iposting) => {
    return (
    <button key={posting.id} className="posting-container" onClick={() => checkDueDate(posting.id)} >
      <img key={posting.id}
        className="posting"
        src={posting.thumbanil}
      />
    </button>
    )
  })
  const writePostingButton = () => {
    return (
      <Link className="write-posting-container" to={`/write/${feedId}`}>
        <div className='write-posting-button'>
          <PlusIcon width={'5vw'}/>
        </div>
      </Link>
    )
  }
  useEffect(() => {
    if (isEmpty) toast('아직 작성된 포스팅이 없습니다')
  }, [isEmpty])
  return (
    <div className='posting-list-wrapper'>
    <div>
      <div className="posting-grid">
        {isGroupFeed ? writePostingButton() : !isOwner && writePostingButton() }
        {!isEmpty && postingList}
      </div>
    </div>
      {isLoading
        ? <Loading />
        : !isReachingEnd && <div className="bottom-element" ref={bottomElement}>
            <ObserverElement />
          </div>
        }
      <Toast />
    </div>
  )
}

export default FeedPostingList
