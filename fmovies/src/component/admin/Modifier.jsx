import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosClient } from '../api/axios';

export default function Modifier() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axiosClient.get(`/user/${id}`)
            .then(response => {
                setUser(response.data); 
            })
            .catch(error => {
                console.error('Error fetching user:', error);
            });
    }, [id]); 

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosClient.put(`/edit/${id}`, user); 
            console.log('User updated:', response.data);
            setLoading(false);
            navigate('/admin');
        } catch (error) {
            setLoading(false);
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('An error occurred:', error.message);
            }
        }
    };

    return (
        <div className="login-container">
        <section className="text-center">
          
                <div className="row d-flex justify-content-center">
                <h2 className="fw-bold mb-5 text-warning">Modifier l'utilisateur : <span className='text-primary'>{user.name}</span></h2>

                    <div className="col-lg-6">
                        <div>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label text-light">Name</label>
                                    <input type="text" className="form-control" value={user.name} onChange={handleChange} />
                                    {errors.name && <p className="text-warning">{errors.name[0]}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label text-light">Email address</label>
                                    <input type="email" className="form-control" value={user.email} onChange={handleChange} />
                                    {errors.email && <p className="text-warning">{errors.email[0]}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label text-light">Password</label>
                                    <input type="password" className="form-control"  value={user.password} onChange={handleChange} />
                                    {errors.password && <p className="text-warning">{errors.password[0]}</p>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="passwordConfirmation" className="form-label text-light">Confirm Password</label>
                                    <input type="password" className="form-control" value={user.password_confirmation} onChange={handleChange} />
                                </div>
                                <button type="submit" className="btn btn-primary btn-block mb-4" disabled={loading}>
                                    {loading ? 'En cours...' : 'Modifier'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            
        </section>
    </div>
    
    );
}
