import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/HomePage/home';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Courses from './pages/CoursePage/Courses';

function App() {

  const Router = createBrowserRouter(
    [
      {
        path:"/",
        element:
        <Home/>
      },
      {
        path:"/Login",
        element:
        <Login/>
      },
      {
        path:"/Register",
        element:
        <Register/>
      },
      {
        path:"/Courses",
        element:
        <Courses/>
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
