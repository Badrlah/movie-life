import React ,{useState , useEffect} from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { axiosClient } from '../api/axios';
import { UserApi } from '../services/User';
export default function ResetPass() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [errors,seterrors]=useState([]);
    const [status,setstatus]=useState(null);
    const {token}=useParams();
    const  [searchParams]=useSearchParams();
    const navigate=useNavigate();
    useEffect(() => {
        setEmail(searchParams.get('email'));
      }, []);
    const handlesubmit =async (e) => {
        e.preventDefault();
        await UserApi.getCsrf();
        seterrors([])
        setstatus(null)
        try {
            const response = await axiosClient.post('/reset-password', { email, token, password, password_confirmation: passwordConfirmation });
            console.log('Response:', response); 
            setstatus(response.data.status);
        } catch (e) {
            console.error('Error:', e); 
            if (e.response && e.response.status === 422) {
                seterrors(e.response.data.errors);
            }
        }
        
    }
  return (
    <div className='container'>
    
        <form onSubmit={handlesubmit}>
            <div className="form-outline mb-4">
            { status && <div className='bg-success text-light  p-3 rounded mb-5'>{status}go to {navigate('/login')}</div> }
            <h3 className='text-light text-centre'>Add your new password </h3>
                <label className="form-label text-light">New Password :</label>
                  <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
                  {errors.password && <p className='text-warning'> {errors.password[0]}</p>}
            </div>
            <div className="form-outline mb-4">
                <label className="form-label text-light">Confirm your Password : </label>
                  <input type="password" className="form-control" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} />
            </div>
                <button type="submit" className="btn btn-primary btn-block mb-4">
                  Submit
                </button>
            </form>
</div>  )
}
