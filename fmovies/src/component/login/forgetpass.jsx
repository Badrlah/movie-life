import React, { useContext, useState } from 'react'
import { authContext } from '../context/Authcontext';
import { axiosClient } from '../api/axios';
import { UserApi } from '../services/User';

export default function Forgetpass() {
    const [email,setemail]=useState("");
    const [errors,seterrors]=useState([]);
    const [status,setstatus]=useState(null);

    const handlesubmit=async (e)=>{
        e.preventDefault();
        await UserApi.getCsrf();
        seterrors([])
        setstatus(null)
        try{
            const response=await axiosClient.post('/forgot-password',{email});
            setstatus(response.data.status)
        }catch(e){
            if(e.response.status===422){
                seterrors(e.response.data.errors)
              }
        }
    };
  return (
    <div className='container'>
     <h1 className='text-light'> Forgot your password?</h1>
 <h3 className='text-warning'>Change your password in three easy steps. This will help you to secure your password!</h3>

  <p className='text-info'>  1. Enter your email address below.</p> 
  <p className='text-info'>2. Our system will send you a temporary link </p>
  <p className='text-info'>3. Use the link to reset your password</p>
         <form onSubmit={handlesubmit} className='card mt-4 bg-transparent'>
         <div className="card-body">
            { status && <div className='bg-success text-light  p-3 rounded mb-5'>{status}</div> }
          <div className="form-group"> 
           <label className="form-label text-light">Email address :</label>
            <input type="email" value={email}  onChange={(e)=>setemail(e.target.value)} className="form-control " />
            {errors.email && <p className='text-warning'> {errors.email[0]}</p>} 
          </div>
          </div>
          <div class="card-footer-transparent">
          <button type="submit" className="btn btn-primary btn-lg " style={{padding:'9px 50px'}}>Get New Password</button>
          </div>
          </form>
    </div>
  )
}
