import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Feed from '@pages/Feed'
import CreateFeed from '@pages/CreateFeed'
import Write from '@pages/Write'
import SignIn from '@pages/SignIn'
import Posting from '@pages/Posting'
import Feeds from '@pages/Feeds'
import Info from '@pages/Info'
import Error from '@pages/Error'
import AuthRoute from '@components/AuthRoute'
import SigninRoute from '@components/SigninRoute'
import { ReactComponent as DesktopSideImage } from '@assets/desktopSideImage.svg'
import './global.scss'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
  <div className='image-wrapper' ><DesktopSideImage width={240}/></div>
  <BrowserRouter>
    <Routes>
      <Route path="/Feed" element={ <AuthRoute><Feed/></AuthRoute> }>
        <Route path=":feedId" element={ <AuthRoute><Feed/></AuthRoute> }/>
        <Route path=":feedId">
          <Route path=":postingId" element={ <AuthRoute><Posting/></AuthRoute> }/>
        </Route>
      </Route>
      <Route path="/Write/:feedId" element={ <AuthRoute><Write/></AuthRoute> } />
      <Route path="/SignIn/Info" element={<SigninRoute><Info/></SigninRoute> } />
      <Route path="/SignIn" element={<SigninRoute><SignIn/></SigninRoute>} />
      <Route path="/Createfeed/:path" element={ <AuthRoute><CreateFeed/></AuthRoute> }/>
      <Route path="/Feeds" element={ <AuthRoute><Feeds/></AuthRoute> } />
      <Route path="/Posting" element={<Posting />} />
      <Route path="/*" element={<Error />} />
    </Routes>
  </BrowserRouter>
  </>
)
