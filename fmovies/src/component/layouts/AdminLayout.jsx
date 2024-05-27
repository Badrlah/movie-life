import React, { useContext, useEffect } from "react";
import AdmiNav from "../nav/admiNav";
import { Outlet, useNavigate } from "react-router-dom";
import { authContext } from "../context/Authcontext";
import { UserApi } from "../services/User";
import './Adminlayout.css';

export default function AdminLayout() {
  const { authenticated,user,setUser} = useContext(authContext);
  const Navigate = useNavigate();
  
  useEffect(() => {
    if (authenticated){
     UserApi.getUser().then((data)=>
     setUser(data.data)    
     )}else{
      Navigate('/login')
    }
    
  } ,[])
    useEffect(() => {
    //   const { data } = await UserApi.getUser();
      if ( user && user.role !== "admin") {
        Navigate("/");
      } 
  }, [user]);
  return (
    <>
      <div>
        <AdmiNav />
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}
