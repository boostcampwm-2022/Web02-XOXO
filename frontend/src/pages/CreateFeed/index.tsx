import React, { useRef, useState } from 'react'
import './styles.scss'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
const CreateFeed = () => {
  const feedName = useRef('')
  const feedDescribe = useRef('')
  const dueDate = useRef('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [members, setMembers] = useState(['백', '규현', '양은서', 'edhz8888', '백규현', 'diddmstj98'])
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
        <div className="form-wrapper">
          <label className="form-label" htmlFor="userId">
            그룹원 추가
          </label>
          <input type="text" id="userId" placeholder="그룹원의 카카오 이메일을 입력해주세요" />
        </div>
        <div className="form-wrapper">
          <label className="form-label" htmlFor="userId">
            그룹원 목록
          </label>
          <span className="form-no-member">현재 추가된 그룹원이 없습니다</span>
          <div className="form-members-wrapper">
            {members.map((name) => (
              // eslint-disable-next-line react/jsx-key
              <button className="form-member">
                <span>{name}</span>
                <XIcon fill="#ea4b35" />
              </button>
            ))}
          </div>
        </div>
        <button className="button-large">피드 생성하기</button>
      </div>
    </div>
  )
}

export default CreateFeed
