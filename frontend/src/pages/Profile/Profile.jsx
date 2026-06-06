import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const {user} = useAuth();

    if(!user){
        return <Navigate to={"/login"}/>;
    }

  return (
    <div>
      Profile Page
    </div>
  )
}

export default Profile