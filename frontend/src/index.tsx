import React from 'react'
import ReactDOM from 'react-dom/client'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import MainPage from '@src/pages/MainPage'
import CreateFeed from '@src/pages/CreateFeed'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/createfeed" element={<CreateFeed />} />
    </Routes>
  </BrowserRouter>
)
