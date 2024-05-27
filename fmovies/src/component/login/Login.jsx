import React, { useState , useContext, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { authContext } from '../context/Authcontext';
import { UserApi } from '../services/User';
import './login.css'
export default function Login() {
  const [email,setemail]=useState('')
  const [load,setLoad]=useState(false)
  const [password,setpassword]=useState('')
  const [errors,seterrors]=useState([]);
  const [remember,setremember]=useState(false);
  const navigate=useNavigate()
  const {login,setAuthenticated,authenticated} = useContext(authContext);

  useEffect(() => {
    const storedRemember = localStorage.getItem('remember');
    if (storedRemember === 'true') {
      const storedEmail = localStorage.getItem('rememberedEmail');
      const storedPassword = localStorage.getItem('rememberedPassword');
      if (storedEmail && storedPassword) {
        setemail(storedEmail);
        setpassword(storedPassword);
        setremember(true);
      }
    }
  }, []);
useEffect(()=>{
  if(authenticated){
    navigate('/')
  }
},[])

  const handlesubmit=async (event)=>{
    event.preventDefault();
  try {
    setLoad(true)
    await login({email,password})
    setAuthenticated(true)
    setLoad(false)
    setemail("");
    setpassword("");
    const {data}= await UserApi.getUser()

    if (remember) {
      localStorage.setItem('rememberedEmail', email);
      localStorage.setItem('rememberedPassword', password);
      localStorage.setItem('remember', true);
    } else {
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('rememberedPassword');
      localStorage.removeItem('remember');
    }
  
    if (data.role ==='admin') {
      console.log('admin');
      navigate("/admin")
    } else {navigate("/"); console.log('user');};
  } catch (e) {
    if(e.response.status===422){
      setLoad(false)
      seterrors(e.response.data.errors)
    }
  }
}
const handleremember = (event) => {
  setremember(event.target.checked);
};


  return (
   

    <div className="login-container" style={{ backgroundImage : 'url(bgNetflix.jpg)' }}>
    <section className="text-center">
       <div className="card-body py-5 px-md-5">
       <div className="row d-flex justify-content-center">
            <div className="col-lg-12">
              <div className="cardLogin">
              <h2 className="fw-bold mb-5 text-center">Login</h2>
              <form onSubmit={handlesubmit} method='POST'>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form2Example1">Email address</label>
                                <input type="email" value={email} onChange={(e) => setemail(e.target.value)} id="form2Example1" className="form-control" />
                                {errors.email && <p className='text-danger'> {errors.email[0]}</p>}
                            </div>
                            <div className="form-outline mb-4">
                                <label className="form-label" htmlFor="form2Example2">Password</label>
                                <input type="password" value={password} onChange={(e) => setpassword(e.target.value)} className="form-control" />
                                {errors.password && <p className='text-danger'> {errors.password[0]}</p>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox" value={remember} onChange={handleremember} checked={remember} />
                                    <label className="form-check-label"> Remember me </label>
                                </div>
                                <Link to='/forget'>Forgot password?</Link>
                            </div>
                            {load ? (
                                <button className="btn btn-primary btn-block mb-4" style={{ padding: '9px 50px' }} disabled><FontAwesomeIcon icon={faSpinner} spin /></button>
                            ) : (
                                <button type="submit" className="btn btn-primary btn-block mb-4" style={{ padding: '9px 50px' }}>Login</button>
                            )}
                        </form>
                        <p className="mt-3">Don't have an account? <Link to='/signup'>Sign up</Link></p>
                    </div>
             
            </div>
            </div>
            </div>
           
    
    </section>
</div>

  )
}
