import React, { useRef, useState } from 'react'
import './style.scss'

import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
import GroupMember from './GroupMember'
import { ISuggestion } from './types'

const CreateFeed = () => {
  const feedName = useRef('')
  const feedDescribe = useRef('')
  const dueDate = useRef('')
  const [members, setMembers] = useState<ISuggestion[]>([])

  return (
    <div className="createfeed-page">
      <Header page="CreateFeed" text={'피드 생성'} />
      <div className="createfeed-body">
        <div className="profile-pic-wrapper">
          <button>
            <div className="profile-pic-circle">
              <img src={defaultUserImage} alt="" />
            </div>
            <span>피드 사진 생성</span>
          </button>
        </div>
        <Input label="제목" placeholder="피드의 제목을 입력해주세요" bind={feedName} />
        <Input
          label="소개"
          placeholder="피드의 소개를 입력해주세요"
          bind={feedDescribe}
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
        <GroupMember members={members} setMembers={setMembers} />
        <button className="button-large">피드 생성하기</button>
      </div>
    </div>
  )
}

export default CreateFeed
