/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useEffect, useRef, useState } from 'react'
import './style.scss'

import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
import GroupMember from './GroupMember'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getWarningDuedate,
  getWarningDescription,
  getWarningName,
  getWarningMembers,
  validDescription,
  validDuedate,
  validMembers,
  validName
} from '@src/util/validation'
import Toast from '@src/components/Toast'
import { isEmpty } from 'lodash'
import CreateFeedButton from './CreateFeedButton'
import { IFeedForm, ISuggestion } from './types'
import { toast } from 'react-toastify'
import { uploadImage } from '@src/util/uploadImage'
import usePost from '@src/hooks/usePost'
import { compressImage } from '@src/util/imageCompress'
import { cropImg } from '@src/util/cropImg'
import { canvasToFile } from '@src/util/canvasToFile'

const CreateFeed = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState<File>()
  const descriptionRef = useRef<HTMLInputElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)
  const [members, setMembers] = useState<ISuggestion[]>([])

  const thumbnailInput = useRef<HTMLInputElement>(null)
  const [thumbnailSrc, setThumbnailSrc] = useState('')
  const navigate = useNavigate()
  const postImage = usePost('/image')

  const { path } = useParams<{ path: string }>()

  useEffect(() => {
    if (!(path === 'group' || path === 'personal')) navigate('/404')
  }, [path])

  const onChangeFeedThumbnail = async (e: any) => {
    setThumbnailSrc(URL.createObjectURL(e.target.files[0]))
    setThumbnail(undefined)
    const croppedCanvas = await cropImg(e.target.files[0])
    const croppedFile = await await canvasToFile(croppedCanvas)
    const compressedImage = await compressImage(croppedFile)
    setThumbnail(compressedImage)
  }

  const onThumbnailUploadClicked = (e: any) => {
    if (!isEmpty(thumbnailInput.current)) thumbnailInput.current.click()
  }
  const getFeedInfos = async (): Promise<IFeedForm | undefined> => {
    if (isEmpty(nameRef.current) || isEmpty(descriptionRef.current) || isEmpty(dueDateRef.current)) {
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

    if (!validDuedate(dueDateRef.current.value)) {
      toast(getWarningDuedate(dueDateRef.current.value))
      return undefined
    }

    if (path === 'group' && !validMembers(members!)) {
      toast(getWarningMembers(members!))
      return undefined
    }

    if (thumbnail === undefined) {
      toast('썸네일 압축 중 입니다.')
      return undefined
    }

    const formData: IFeedForm = {
      name: nameRef.current.value,
      description: descriptionRef.current.value,
      dueDate: dueDateRef.current.value,
      thumbnail: await getThumbnailUrl()
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
  return (
    <div className="createfeed-page">
      <Header page="CreateFeed" text={'피드 생성'} />
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
          <input type="file" accept="image/*" ref={thumbnailInput} onChange={onChangeFeedThumbnail} />
        </div>
        <Input label="제목" placeholder="피드의 제목을 입력해주세요" bind={nameRef} validate={getWarningName} />
        <Input
          label="소개"
          placeholder="피드의 소개를 입력해주세요"
          bind={descriptionRef}
          validate={getWarningDescription}
        />
        <Input
          label="공개일"
          placeholder="피드의 공개일을 설정해주세요"
          type="date"
          bind={dueDateRef}
          validate={getWarningDuedate}
        />
        {path === 'group' && <GroupMember members={members} setMembers={setMembers} />}
        <CreateFeedButton getFeedInfos={getFeedInfos} />
        <Toast />
      </div>
    </div>
  )
}

export default CreateFeed
