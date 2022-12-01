/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import './style.scss'

import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
import GroupMember from './GroupMember'
import { ISuggestion } from './types'
import { compressImage } from '@src/util/imageCompress'
import usePost from '@hooks/usePost'

interface ICreateFeed {
  path: string
}

const CreateFeed = ({ path }: ICreateFeed) => {
  const name = useRef('')
  const [thumbnail, setThumbnail] = useState<File>()
  const description = useRef('')
  const dueDate = useRef('')

  const [members, setMembers] = useState<ISuggestion[]>([])

  const feedThumbnail = useRef<HTMLInputElement | null>(null)
  const [thumbnailSrc, setThumbnailSrc] = useState(defaultUserImage)
  const postImage = usePost('/image')
  const postPersonalFeed = usePost('/feed')
  const postGroupFeed = usePost('/feed/group')

  const onChangeFeedThumbnail = async (e: any) => {
    const compressedImage = await compressImage(e.target.files[0])
    setThumbnail(compressedImage)
    const url = URL.createObjectURL(compressedImage)
    setThumbnailSrc(url)
  }

  const onThumbnailUploadClicked = (e: any) => {
    if (feedThumbnail.current !== null) feedThumbnail.current.click()
  }

  const onFeedBtnClicked = async () => {
    const [thumbnail] = await uploadImage()
    let form = {
      name: name.current,
      thumbnail: thumbnail.current,
      description: description.current,
      dueDate: dueDate.current
    }

    if (path === 'group') {
      const memberIdList = members.map(({ id }) => id)
      form = { ...form, memberIdList: JSON.stringify(memberIdList) }
    }

    if (path === 'personal') {
      const response = await postPersonalFeed(formData)
      console.log(response)
    }
    if (path === 'group') {
      const response = await postGroupFeed(formData)
      console.log(response)
    }
  }

  const uploadImage = async () => {
    const formData = new FormData()
    if (thumbnail === undefined) return ''
    formData.append('image', thumbnail)
    const response = await postImage(formData)
    if (response !== undefined) return response.data
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
              />
            </div>
            <span>피드 사진 생성</span>
          </button>
          <input type="file" accept="image/*" ref={feedThumbnail} onChange={onChangeFeedThumbnail} />
        </div>
        <Input label="제목" placeholder="피드의 제목을 입력해주세요" bind={name} />
        <Input
          label="소개"
          placeholder="피드의 소개를 입력해주세요"
          bind={description}
          validate={(str) => {
            return str.length > 4 ? '5자이상입니다.' : ''
          }}
        />
        <Input
          label="공개일"
          placeholder="피드의 공개일을 설정해주세요"
          type="date"
          bind={dueDate}
          validate={(_) => '한번 설정한 공개일은 추후에 바꿀 수 없습니다'}
        />
        {path === 'group' && <GroupMember members={members} setMembers={setMembers} />}
        <button className="button-large" onClick={onFeedBtnClicked}>
          피드 생성하기
        </button>
      </div>
    </div>
  )
}

export default CreateFeed
