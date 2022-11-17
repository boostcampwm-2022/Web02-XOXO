import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Feed from '@src/pages/Feed'
import CreateFeed from '@src/pages/CreateFeed'
import SignIn from '@src/pages/SignIn'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/Feed" element={<Feed />} />
      <Route path="/createfeed" element={<CreateFeed />} />
      <Route path="/SignIn" element={<SignIn />} />
    </Routes>
  </BrowserRouter>
)
