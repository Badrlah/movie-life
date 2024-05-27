import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authContext } from '../context/Authcontext';

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();
  const {authenticated,register} = useContext(authContext);

  const handleSubmit = async (event) => {
    event.preventDefault();    
    try {
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation 
      });
      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");
      navigate('/login'); 
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("An error occurred:", error.message);
      }
    }
  }
  useEffect(()=>{
    if(authenticated){
      navigate('/')
    }
  },[])
 
  return (
    <div className='login-container' style={{ backgroundImage: `url('bgNetflix.jpg')` }}>
      <section className="text-center">
        <div className="card-body py-5 px-md-5">
          <div className="row d-flex justify-content-center">
            <div className="col-lg-12">
              <div className="cardLogin">
              <h2 className="fw-bold mb-5 ">Sign up now</h2>
              <form onSubmit={handleSubmit} >
                <div className="row">
                  <div className="col-md-12 mb-4">
                    <div className="form-outline">
                    <label className="form-label">First name</label>
                      <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                      {errors.name && <p className='text-danger'> {errors.name[0]}</p>}
                    </div>
                  </div>
                </div>
                <div className="form-outline mb-4">
                <label className="form-label">Email address</label>
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className='text-danger'> {errors.email[0]}</p>}
                </div>
                <div className="form-outline mb-4">
                <label className="form-label">Password</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className='text-danger'> {errors.password[0]}</p>}
                </div>
                <div className="form-outline mb-4">
                <label className="form-label">Confirm your Password </label>
                  <input type="password" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Sign up
                </button>
              </form>
            </div></div>
          </div>
        </div>
      </section>
    </div>
  );
}
