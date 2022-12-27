/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useRef, useState } from 'react'
import useSWR from 'swr'
import { isEmpty } from 'lodash'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import './style.scss'
import GroupMember from './GroupMember'
import EditFeedButton from './EditFeedButton'
import { IFeedForm, ISuggestion } from './types'
import Error from '../Error'
import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@components/Header'
import Input from '@components/Input'
import Toast from '@components/Toast'
import usePost from '@hooks/usePost'
import { compressImage } from '@util/imageCompress'
import { cropImg } from '@util/cropImg'
import { canvasToFile } from '@util/canvasToFile'
import fetcher from '@util/fetcher'
import { getFeedThumbUrl } from '@util/imageQuery'
import { uploadImage } from '@util/uploadImage'
import {
  getWarningDescription,
  getWarningName,
  getWarningMembers,
  validDescription,
  validMembers,
  validName
} from '@util/validation'

interface IFeedInfo {
  name: string
  thumbnail: string
  description: string
  dueDate: string
  isOwner: boolean
  isGroupFeed: boolean
  postingCnt: number
}

const EditFeed = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState<File>()
  const descriptionRef = useRef<HTMLInputElement>(null)
  const [members, setMembers] = useState<ISuggestion[]>([])
  const [isExistThumb, setIsExistThumb] = useState<Boolean>(false)
  const thumbnailInput = useRef<HTMLInputElement>(null)
  const [thumbnailSrc, setThumbnailSrc] = useState('')
  const postImage = usePost('/image')
  const { path, feedId } = useParams<{ path: string, feedId: string }>()
  const { data: feedInfo, error: feedError } = useSWR<IFeedInfo>(
    feedId !== undefined ? `/feed/info/${feedId}` : null,
    fetcher
  )

  useEffect(() => {
    if (feedInfo !== undefined) {
      setThumbnailSrc(getFeedThumbUrl(feedInfo?.thumbnail as string))
      setIsExistThumb(true)
    }
  }, [feedInfo])

  useEffect(() => {
    console.log('thumbnailSrc : ', thumbnailSrc)
  }, [thumbnailSrc])

  const onChangeFeedThumbnail = async (e?: any, defaultImage?: string) => {
    setThumbnailSrc(URL.createObjectURL(e.target.files[0]))
    setThumbnail(undefined)
    const croppedCanvas = await cropImg(e.target.files[0])
    const croppedFile = await canvasToFile(croppedCanvas)
    const compressedImage = await compressImage(croppedFile)
    setThumbnail(compressedImage)
    setIsExistThumb(false)
  }

  const onThumbnailUploadClicked = (e: any) => {
    if (!isEmpty(thumbnailInput.current)) thumbnailInput.current.click()
  }

  const getFeedInfos = async (): Promise<IFeedForm | undefined> => {
    if (isEmpty(nameRef.current) || isEmpty(descriptionRef.current)) {
      toast('페이지에 오류가 있습니다. 새로고침 후 다시 작성해주세요.')
      return undefined
    }
    if (!validName(nameRef.current.value)) {
      toast(getWarningName(nameRef.current.value))
      return undefined
    }
    if (!validDescription(descriptionRef.current.value)) {
      toast(getWarningDescription(descriptionRef.current.value))
      return undefined
    }
    if (path === 'group' && !validMembers(members!)) {
      toast(getWarningMembers(members!))
      return undefined
    }
    if (!isExistThumb && thumbnail === undefined) {
      toast('썸네일 압축 중 입니다.')
      return undefined
    }
    const formData: IFeedForm = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      dueDate: feedInfo?.dueDate,
      thumbnail: isExistThumb ? feedInfo?.thumbnail : await getThumbnailUrl()
    }
    const memberIdList = getMembers()
    if (!isEmpty(members)) formData.memberIdList = memberIdList
    return formData
  }

  const getThumbnailUrl = async () => {
    const [thumbnailUrl] = await uploadImage([thumbnail!], postImage)
    return thumbnailUrl as string
  }

  const getMembers = () => {
    if (path !== 'group') return undefined
    return members.map(({ id }) => Number(id))
  }

  if (!(path === 'group' || path === 'personal')) return <Error />

  return (
    <div className="createfeed-page">
      <Header page="CreateFeed" text={'피드 수정'} />
      <div className="createfeed-body">
        <div className="profile-pic-wrapper">
          <button onClick={onThumbnailUploadClicked}>
            <div className="profile-pic-circle">
              <img
                src={thumbnailSrc}
                alt="프로필 썸네일 미리보기"
                onLoad={() => {
                  URL.revokeObjectURL(thumbnailSrc)
                }}
                onError={(e) => {
                  setThumbnailSrc(defaultUserImage)
                }}
              />
            </div>
            <span>피드 사진 생성</span>
          </button>
          <input type="file" accept="image/jpeg, image/png" ref={thumbnailInput} onChange={onChangeFeedThumbnail}/>
        </div>
        <Input label="제목" placeholder="피드의 제목을 입력해주세요" bind={nameRef} validate={getWarningName} defaultValue={feedInfo?.name as string}/>
        <Input
          label="소개"
          placeholder="피드의 소개를 입력해주세요"
          bind={descriptionRef}
          validate={getWarningDescription}
          defaultValue={feedInfo?.description as string}
        />
        {path === 'group' && <GroupMember members={members} setMembers={setMembers} />}
        <EditFeedButton getFeedInfos={getFeedInfos} />
        <Toast />
      </div>
    </div>
  )
}

export default EditFeed
