import React, { useState, createContext, useEffect } from 'react';
import { UserApi } from '../services/User';

export const authContext = createContext({
  user:null,
  authenticated:false,
  setUser:()=>{},
  setAuthenticated:()=>{},
  logout:()=>{},
  getUser:()=>{},
  login:(data)=>{},
  register:(data)=>{},
  sendMovie:(data)=>{},
});

function Authcontext({ children }) {
  const [user,setUser]=useState()
  const [authenticated,_setAuthenticated]=useState(JSON.parse(window.localStorage.getItem('ACCESS_TOKEN')))
  const login= async(data)=>{
      await UserApi.getCsrf()
      return  UserApi.login(data)
    }
  const sendMovie=async (data)=>{
    await UserApi.getCsrf()
    return UserApi.sendMovie(data)
  }

  const setAuthenticated=(value)=>{
      _setAuthenticated(value)
      window.localStorage.setItem('ACCESS_TOKEN',value)
  }


  const logout=async()=>{
      return await UserApi.logout()
  }

  const getUser=async()=>{
    const {data} =await UserApi.getUser()
    setUser(data)

}
const register=async(data)=>{
  await UserApi.getCsrf()
  return  UserApi.register(data)
}
  return (
    <authContext.Provider value={{
      user,
      authenticated,
      setUser,
      setAuthenticated,
      logout,
      getUser,
      login,
      register,
      sendMovie
    }}>
      {children}
    </authContext.Provider>
  );
}

export default Authcontext;