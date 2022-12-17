
![대표이미지](https://user-images.githubusercontent.com/58061756/205224750-21562b0f-8430-4a83-90c3-46b095834e60.png)
# 📸 남이 꾸며주는 내 피드!

**my feed, our memory!**

XOXO를 통해 우리만의 추억을 공유해보세요 😉
## 🔗 바로가기

[**🎨 Figma**](https://www.figma.com/file/K0yjvdx9wh8zgwbCCp0m98/web02-xoxo?node-id=0%3A1&t=vBAEWgvNcUjFYlEv-0) / [**📃 Wiki**](https://github.com/boostcampwm-2022/Web02-XOXO/wiki) / [**💭 Notion**](https://www.notion.so/ebf0ede8ade04eb297fa9bb3697984bd) / [**🎄 배포 링크**](http://www.xoxoforyou.me)
## 🚊 #신분당선#자만추

[J095 백규현](https://github.com/edhz8) | [J114 양은서](https://github.com/yess98) | [J132 윤정민](https://github.com/jungmiin) | [J212 최현서](https://github.com/CHOIHYEONSEO)

## 🎄서비스 소개

일반 SNS와 달리 **상대방이 내 피드를 꾸며주는🎨** 서비스 입니다.

각 피드는 생성시에 최초로 **공개일 설정**을 할 수 있으며, 

해당 공개일이 되기 전까지는 포스팅을 열람할 수 없습니다.

두근두근! 친구들이 꾸며준 내 피드를 설레는 마음으로 기다려 보세요.

### ✨ 피드 생성

- 한 사용자가 여러개의 피드를 생성할 수 있습니다.
- 피드는 `개인 피드`와 `그룹 피드`로 나뉘며, 생성할 때 타입을 선택할 수 있습니다.
- 공개일은 현재 날짜를 기준으로 내일부터 설정할 수 있으며, 이후에 수정은 불가능 합니다.

<table>
   <thead>
      <tr>
         <th width="500px">👤 개인 피드</th>
         <th width="500px">👥 그룹 피드</th>
      </tr>
   </thead>
   <tbody>
      <tr width="600px">
         <td>
            <img src="https://user-images.githubusercontent.com/58061756/208254278-38682001-2576-4bde-832a-c7a6d065a3a4.gif">
         </td>
         <td>
            <img src="https://user-images.githubusercontent.com/58061756/208254287-a0e14f1e-829d-4d09-8951-17a477ad1b1e.gif">
       </td>
      </tr>
   </tbody>
</table>

### 🎈 피드 공유

- `내 피드 공유하기` 버튼을 누르게 되면, 자동으로 카카오톡과 연동됩니다.
    - **카카오 메시지 API** 를 이용해 직접 메시지 템플릿을 설정하여 구현하였습니다.
<table>
   <thead>
      <tr>
         <th width="500px">💌 피드 공유하기</th>
         <th width="500px">📮 피드 공유받기</th>
      </tr>
   </thead>
   <tbody>
      <tr width="600px">
         <td>
            <img src="https://user-images.githubusercontent.com/58061756/208255721-a2dc1003-71df-46cf-83cc-97f23742b70e.gif">
         </td>
         <td>
		 <img src="https://user-images.githubusercontent.com/58061756/208255766-1052d4f9-40ed-455e-a31c-d5e3d2e79939.gif">
       </td>
      </tr>
   </tbody>
</table>

### 🎉 포스팅 작성

<table>
   <thead>
      <tr>
         <th width="500px">🎉 포스팅 작성</th>
         <th width="500px">설명</th>
      </tr>
   </thead>
   <tbody>
      <tr width="600px">
         <td>
		 <img src="https://user-images.githubusercontent.com/58061756/208255773-7150f733-b718-41e8-9dce-7eebc37a15fe.gif">
         </td>
         <td>
		 
- **포스팅을 작성할 수 있는 경우는 두가지가 존재합니다.**

    - 그룹 피드
	
        - **주인과 초대받은 사람 모두 작성**할 수 있습니다.
		
    - 개인 피드
	
        - **주인은 작성하지 못하며**, 해당 링크를 들어간 주인이 아닌 사용자 모두 작성할 수 있습니다.
		
- **포스팅은 최대 10장의 사진을 올릴 수 있습니다.**

    - 그중 **맨 앞의 사진이 자동으로 썸네일로 설정**되며, 이는 `pixelate` 되어 보여집니다.
	
    - 이미지는 **서버를 통해 object storage에 올라가게 되며**, 서버와 object storage의 부하를 줄이기 위해, **클라이언트에서 자체적으로 모든 이미지를 500kb 이하로 압축**시킵니다.
       </td>
      </tr>
   </tbody>
</table>

### ♥ 포스팅 리스트

<table>
   <thead>
      <tr>
         <th width="500px">♥ 포스팅 리스트</th>
         <th width="500px">설명</th>
      </tr>
   </thead>
   <tbody>
      <tr width="600px">
         <td>
		 <img src="https://user-images.githubusercontent.com/58061756/208255839-98b7914d-9c39-4ef3-a24d-31aa5d2df9a1.gif">
         </td>
         <td>

- `Intersection Observer API`를 이용한 **무한스크롤을 구현**하였습니다.
    - 기본적으로 각 포스팅의 썸네일은 15개씩(혹은 14개씩) 가져옵니다.
    - 만약 맨 하단의 `bottomElement`가 사용자에게 보여지면, 그것을 감지해서 자동으로 새로운 데이터를 `fetch` 해 옵니다.
    - 게시물을 모두 가져오면, 하단의 `bottomElement` 는 사라짐으로써 무한정으로 `fetch` 를 시도하지 않도록 하였습니다.
- `Image Optimizer` 를 이용해 **각 사용자의 화면 크기에 맞는 썸네일**을 받아오도록 하였습니다.
    - `level5` (width>500px)
        
        썸네일 크기 **(240px*240px)**
        
    - `level4` (500px>width>400px)
        
        썸네일 크기 **(180px*180px)**
        
    - `level3` (300px>width)
        
        썸네일 크기 **(120px*120px)**

       </td>
      </tr>
   </tbody>
</table>


### 🎁 포스팅 열람

<table>
   <thead>
      <tr>
         <th width="500px">⏰공개일이 지나기 전</th>
         <th width="500px">🤩 공개일이 지난 후</th>
      </tr>
   </thead>
   <tbody>
      <tr width="600px">
         <td>

<img src="https://user-images.githubusercontent.com/58061756/208255976-de32bb41-4f47-4292-b26b-0b1370713f93.gif">

- ❌ **포스팅을 열람할 수 없습니다.**
- 남은 시간을 알려주는 토스트를 띄웁니다.
- 클라이언트에서 시간을 변조해 포스팅을 보는 행위를 방지하기 위해, 포스팅을 클릭할 때마다, **서버 시간**을 확인하여 검사하였습니다.
</td>	 
<td>

<img src="https://user-images.githubusercontent.com/58061756/208255923-d8dbb915-8c1c-4ffa-8ce5-5f63481a4060.gif">

- ⭕ **포스팅을 열람할 수 있습니다.**
- 최대 10장의 이미지가 캐러셀의 형태로 보여집니다.
- 더 좋은 UX와 성능을 위해 **LQIP**방식을 도입하였습니다.
       </td>
      </tr>
   </tbody>
</table>


## 기술스택

![기술 스택](https://user-images.githubusercontent.com/58061756/205233670-e0641372-a713-45fc-b4ab-b5bbdef31d42.png)
