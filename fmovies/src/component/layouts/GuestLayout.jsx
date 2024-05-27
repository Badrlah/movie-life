import React, { useContext, useEffect } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { authContext } from "../context/Authcontext";
import UserNav from "../nav/userNav";
import AdmiNav from "../nav/admiNav";
import { UserApi } from "../services/User";

export default function () {
  const { authenticated, user, setUser } = useContext(authContext);
  useEffect(() => {
    if (authenticated){
     UserApi.getUser().then((data)=>
        setUser(data.data)    
    )}
    
  } ,[authenticated])
  return (
    <div style={{ backgroundColor : 'rgb(23, 23, 53)' }}>
    {user ?
    <div>
    { user.role==='user'?
    <UserNav/>:<AdmiNav/>
      }
  </div>
    :
<div style={{ backgroundColor: 'rgba(23, 23, 53, 5)'}}>
      <nav className='navbar navbar-expand-lg'>
        <div className='container'>
          <h2>
            <NavLink className='navbar-brand text-light' to="/"> <img src="src\logo.png" style={{ width : '50px', height:"40px"}} />Movies Life</NavLink>
          </h2>
          <ul className='nav nav-underline'>
            <div className="d-flex align-items-center gap-3">
              
                  <Link to='/login' className="btn btn-link text-info px-3 me-2">Login</Link>
                  <Link to='/signup' className="btn btn-primary me-3">Sign Up</Link>
                
            </div>
          </ul>
        </div>
      </nav>
    </div>
    }
      
      <div>
        <Outlet />
      </div>
    </div>
  );
}
