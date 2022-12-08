/* eslint-disable @typescript-eslint/member-delimiter-style */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './style.scss'

import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
import GroupMember from './GroupMember'
import { compressImage } from '@src/util/imageCompress'
import usePost from '@hooks/usePost'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getWarningDuedate,
  getWarningDescription,
  getWarningName,
  validName,
  validDescription,
  validDuedate,
  validMembers,
  getWarningMembers
} from '@src/util/validation'
import Toast from '@src/components/Toast'
import { toast } from 'react-toastify'
import { isEmpty } from 'lodash'
import { ISuggestion } from '@src/types'
import { yyyymmdd } from '@src/util'

interface ICreateFeed {
  path: string
}

interface feedForm {
  name?: string
  thumbnail?: string
  description?: string
  dueDate?: string
  memberIdList?: number[]
}

const CreateFeed = () => {
  const nameRef = useRef<HTMLInputElement>(null)
  const [thumbnail, setThumbnail] = useState<File>()
  const descriptionRef = useRef<HTMLInputElement>(null)
  const dueDateRef = useRef<HTMLInputElement>(null)

  const [members, setMembers] = useState<ISuggestion[]>([])

  const feedThumbnail = useRef<HTMLInputElement>(null)
  const [thumbnailSrc, setThumbnailSrc] = useState('')
  const postImage = usePost('/image')
  const postPersonalFeed = usePost('/feed')
  const postGroupFeed = usePost('/feed/group')
  const navigate = useNavigate()

  const { path } = useParams<{ path: string }>()

  useEffect(() => {
    if (!(path === 'group' || path === 'personal')) navigate('/404')
  }, [path])

  useEffect(() => {
    if (!isEmpty(dueDateRef.current)) {
      const min = new Date()
      min.setDate(min.getDate() + 1)
      dueDateRef.current.min = yyyymmdd(min)
    }
  })

  const onChangeFeedThumbnail = async (e: any) => {
    const url = URL.createObjectURL(e.target.files[0])
    setThumbnailSrc(url)

    const compressedImage = await compressImage(e.target.files[0])
    setThumbnail(compressedImage)
  }

  const onThumbnailUploadClicked = (e: any) => {
    if (!isEmpty(feedThumbnail.current)) feedThumbnail.current.click()
  }

  const onFeedBtnClicked = async () => {
    if (isEmpty(nameRef.current) || isEmpty(descriptionRef.current) || isEmpty(dueDateRef.current)) {
      toast('페이지에 오류가 있습니다. 새로고침 후 다시 작성해주세요.')
      return
    }
    const formData: feedForm = {}

    if (validName(nameRef.current.value)) formData.name = nameRef.current.value
    else {
      toast(getWarningName(nameRef.current.value))
      return
    }

    if (validDescription(descriptionRef.current.value)) formData.description = descriptionRef.current.value
    else {
      toast(getWarningDescription(nameRef.current.value))
      return
    }

    if (validDuedate(dueDateRef.current.value)) formData.dueDate = dueDateRef.current.value
    else {
      toast(getWarningDuedate(dueDateRef.current.value))
      return
    }

    const [thumbnail] = await uploadImage()
    formData.thumbnail = thumbnail

    if (path === 'group') {
      if (validMembers(members)) {
        const memberIdList = members.map(({ id }) => Number(id))
        formData.memberIdList = memberIdList
      } else {
        toast(getWarningMembers(members))
      }
    }
    console.log(formData)

    if (path === 'personal') {
      const { success, data }: { success: boolean; data: string } = await postPersonalFeed(formData)
      if (success) navigate(`/Feed/${data}`)
    }
    if (path === 'group') {
      const { success, data }: { success: boolean; data: string } = await postGroupFeed(formData)
      if (success) navigate(`/Feed/${data}`)
    }
  }

  const uploadImage = async () => {
    const formData = new FormData()
    if (isEmpty(thumbnail)) return ''
    formData.append('image', thumbnail)
    const { success, data } = await postImage(formData)
    if (success === false) toast('이미지 업로드 중 문제가 발생했습니다.')
    return data
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
                alt=""
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
          <input type="file" accept="image/*" ref={feedThumbnail} onChange={onChangeFeedThumbnail} />
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
        <button className="button-large" onClick={onFeedBtnClicked}>
          피드 생성하기
        </button>
        <Toast />
      </div>
    </div>
  )
}

export default CreateFeed
