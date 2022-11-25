import React, { useRef, useState } from 'react'
import './style.scss'
import { ReactComponent as XIcon } from '@assets/XIcon.svg'
import defaultUserImage from '@assets/defaultUserImage.svg'
import Header from '@src/components/Header'
import Input from '@src/components/Input'
import { debounce } from 'lodash'
const CreateFeed = () => {
  const feedName = useRef('')
  const feedDescribe = useRef('')
  const dueDate = useRef('')
  // 그냥 mockup으로 넣어둠
  const fakeMembers = ['백', '규현', '양은서', 'edhz8888', '백규현', 'diddmstj98']
  const [suggestions, setSuggestions] = useState(Array(0))
  const [members, setMembers] = useState(Array(0))
  const debouncedSearch = debounce((query) => {
    setSuggestions([...fakeMembers.filter((e) => query.length > 0 && e.includes(query))])
  }, 500)
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
          <input
            type="text"
            id="userId"
            placeholder="그룹원의 카카오 이메일을 입력해주세요"
            onChange={(e) => {
              debouncedSearch(e.target.value)
            }}
          />
        </div>
        <div className="suggestions-wrapper">
          {suggestions.map((nickname, i) => (
            <button
              className="suggestion-wrapper"
              key={i}
              onClick={(e) => {
                e.preventDefault()
                setMembers([...members, nickname])
              }}
            >
              <span className="suggestion-nickname">{nickname}</span>
              <span className="suggestion-add">추가</span>
            </button>
          ))}
        </div>
        <label className="form-label" htmlFor="">
          그룹원 목록
        </label>
        {
          // eslint-disable-next-line multiline-ternary
          members.length === 0 ? (
            <span className="form-no-member">현재 추가된 그룹원이 없습니다</span>
          ) : (
            <div className="form-members-wrapper">
              {members.map((name, i) => (
                // eslint-disable-next-line react/jsx-key
                <button
                  className="form-member"
                  onClick={(e) => {
                    e.preventDefault()
                    setMembers(members.filter((member) => member !== name))
                  }}
                >
                  <span>{name}</span>
                  <XIcon fill="#ea4b35" />
                </button>
              ))}
            </div>
          )
        }
        <button className="button-large">피드 생성하기</button>
      </div>
    </div>
  )
}

export default CreateFeed
