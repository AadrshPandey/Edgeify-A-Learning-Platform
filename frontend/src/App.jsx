import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import { useEffect } from 'react';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import Home from './Pages/Home/Home';
import Courses from './Pages/Courses/Courses';
import CourseDetail from './Pages/CourseDetail/CourseDetail';
import Profile from './Pages/Profile/Profile';
import VideoPlayer from './Pages/VideoPlayer/VideoPlayer';
import PublicOnlyRoute from './Services/PublicOnlyRoute';
import ProtectedRoute from './Services/ProtectedRoute';

function App() {
  

  const Router = createBrowserRouter(
    [
      {
        path : "/auth/login",
        element : <PublicOnlyRoute> <Login/> </PublicOnlyRoute>
      },
      {
        path : "/auth/register",
        element : <PublicOnlyRoute> <Register/> </PublicOnlyRoute>
      },
      {
        path : "/",
        element : <Home/>
      },
      {
        path : "/courses",
        element : <Courses/>
      },
      {
        path : "/courses/:courseId",
        element : <CourseDetail/>
      },
      {
        path : "/courses/:courseId/:videoId",
        element : <VideoPlayer/>
      },
      {
        path : "/profile",
        element : <ProtectedRoute> <Profile/> </ProtectedRoute>
      }
    ]
  );

  return (
    <>
      <RouterProvider router={Router}/>
    </>
  )
}

export default App
