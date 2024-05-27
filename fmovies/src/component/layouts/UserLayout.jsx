import React, { useContext, useEffect } from 'react'
import UserNav from '../nav/userNav'
import { Outlet, useNavigate } from 'react-router-dom'
import { UserApi } from '../services/User';
import { authContext } from '../context/Authcontext';

export default function UserLayout() {
  const { authenticated,user,setUser} = useContext(authContext);
  const Navigate = useNavigate();
  
  useEffect(() => {
    if (authenticated){
     UserApi.getUser().then((data)=>
        setUser(data.data)    
    )}else{
        Navigate('/login')
    }
    
  } ,[authenticated])
    useEffect(() => {
      if ( user && user.role !== "user") {
        Navigate("/admin");
      } 
  }, [user]);
  return (
    <>
    <div>
        <UserNav/>
    </div>
    <div style={{ backgroundColor :'rgba(23, 23, 53, 5)' }}>
        <Outlet/>
    </div>
    </>
  )
}
