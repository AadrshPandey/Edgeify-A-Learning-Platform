import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Home from './pages/HomePage/home';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import Courses from './pages/CoursePage/Courses';
import Profile from './pages/Profile/Profile';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';

function App() {

  const {setUser} = useAuth();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try{
        const response = await fetch(
          `/api/v1/user/current-user`,
          {
            method : "POST",
            credentials: 'include'
          }
        )

        if(response.ok){
          const data = await response.json();

          setUser(data.data);
        }
        else{
          console.log("Data Not Fetched");
        }

      } catch(error){
        console.log(error);
      }
    }

    fetchCurrentUser();
  }, []);

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
      },
      {
        path:"/Profile",
        element:
        <Profile/>
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
