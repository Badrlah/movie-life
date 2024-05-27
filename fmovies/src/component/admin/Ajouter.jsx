import React , {useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { axiosClient } from '../api/axios';

export default function Ajouter() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();    
        try {
          await axiosClient.post('/ajouter',{
            name,
            email,
            password,
            password_confirmation: passwordConfirmation 
          });
          setName("");
          setEmail("");
          setPassword("");
          setPasswordConfirmation("");
          navigate('/admin'); 
        } catch (error) {
          if (error.response && error.response.status === 422) {
            setErrors(error.response.data.errors);
          } else {
            console.error("An error occurred:", error.message);
          }
        }
      }
  return (
    <div>
    <section className="text-center">
      <div className="card-body py-5 px-md-5">
        <div className="row d-flex justify-content-center">
          <div className="col-lg-8">
            <h2 className="fw-bold mb-5 text-light">Ajouter user </h2>
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="form-outline">
                  <label className="form-label text-light">First name</label>
                    <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
                    {errors.name && <p className='text-warning'> {errors.name[0]}</p>}
                  </div>
                </div>
              </div>
              <div className="form-outline mb-4">
              <label className="form-label text-light">Email address</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className='text-warning'> {errors.email[0]}</p>}
              </div>
              <div className="form-outline mb-4">
              <label className="form-label text-light">Password</label>
                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                {errors.password && <p className='text-warning'> {errors.password[0]}</p>}
              </div>
              <div className="form-outline mb-4">
              <label className="form-label text-light">Confirm your Password </label>
                <input type="password" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary btn-block mb-4">
                Ajouter
              </button>
              
            </form>
            
          </div>
          
        </div>
      </div>
    </section>
    
    </div>
  )
}
