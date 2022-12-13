/* eslint-disable @typescript-eslint/no-misused-promises */
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
import useGet from '@hooks/useGet'
import useInfiniteScroll from '@hooks/useInfiniteScroll'
import { isFutureRatherThanServer } from '@util/validation/bool'
import { remainDueDate } from '@util/index'
import fetcher from '@util/fetcher'
import { getFeedThumbUrl } from '@util/imageQuery'
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
  const navigate = useNavigate()
  const { feedId } = useParams<{ feedId: string }>()

  const getKey = (pageIndex: number, previousPageData: Iposting[]) => {
    if (previousPageData && !previousPageData.length) return null
    if (pageIndex === 0) return `/feed/scroll/${feedId}?size=${isGroupFeed ? SCROLL_SIZE - 1 : (isOwner ? SCROLL_SIZE : SCROLL_SIZE - 1)}&index=${pageIndex}`
    return `/feed/scroll/${feedId}?size=${SCROLL_SIZE}&index=${previousPageData[previousPageData.length - 1].id}`
  }
  const { data: postings, error, size, setSize } = useSWRInfinite(getKey, fetcher, { initialSize: 1, revalidateFirstPage: false })
  const getServerDate = useGet('/serverTime')

  // 리스트 로딩중일 때
  const isLoading = (!postings && !error) || (size > 0 && postings && typeof postings[size - 1] === 'undefined')
  // 리스트를 정상적으로 받아왔지만 비어있을 경우 (게시글이 작성되지 않았을 경우)
  const isEmpty = postings?.[0]?.length === 0
  // 쓰기 버튼이 존재할때 리스트의 끝에 도달했는지 판단
  const isExistWriteButton = (postings != null) && ((postings.length === 1 && postings[0].length < SCROLL_SIZE - 1) || (postings.length > 1 && postings[postings.length - 1].length < SCROLL_SIZE))
  // 쓰기 버튼이 존재하지 않을 때 리스트의 끝에 도달했는지 판단
  const isNotExistWriteButton = (postings != null) && (postings[postings.length - 1].length < SCROLL_SIZE)
  // 그룹피드, 개인 피드의 주인, 개인 피드의 주인이 아닐 때 리스트의 끝에 도달했는지 판단
  const isReachingEnd = (isGroupFeed && isExistWriteButton) || (!isGroupFeed && !isOwner && isExistWriteButton) || (!isGroupFeed && isOwner && isNotExistWriteButton)

  const bottomElement = useInfiniteScroll(postings, () => {
    !isReachingEnd && setSize(size => size + 1)
  })

  useEffect(() => {
    if (isEmpty) toast('아직 작성된 포스팅이 없습니다')
  }, [isEmpty])

  const checkReadable = async (id: string) => {
    const { data: serverDate } = await getServerDate()
    if (!isOwner) {
      toast('피드의 주인만 포스팅을 열람할 수 있습니다.')
    } else if (isFutureRatherThanServer(dueDate, serverDate)) {
      toast(`게시물이 공개되기까지 ${remainDueDate(dueDate, serverDate)} 남았어요`)
    } else navigate(`${id}`)
  }

  const postingList = postings?.flat().map((posting: Iposting) => {
    console.log(isLoading, isEmpty, isReachingEnd, postings, isOwner, isGroupFeed, (isGroupFeed || (!isOwner && !isGroupFeed)), postings[0]?.length < SCROLL_SIZE - 1)
    return (
    <button key={posting.id} className="posting-container" onClick={() => checkReadable(posting.id)} >
      <img key={posting.id}
        className="posting"
        src={getFeedThumbUrl(posting.thumbanil)}
      />
    </button>
    )
  })

  const writePostingButton =
  <Link className="write-posting-container" to={`/write/${feedId}`}>
    <div className='write-posting-button'>
      <PlusIcon width={'5vw'}/>
    </div>
  </Link>

  return (
    <div className='posting-list-wrapper'>
    <div>
      <div className="posting-grid">
        {isGroupFeed ? writePostingButton : !isOwner && writePostingButton }
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
