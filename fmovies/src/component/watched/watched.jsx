import React from 'react';
import './watched.css';
import { useDispatch, useSelector } from 'react-redux';
import { RemoveMovieFromWatched, setMoviesfromwatched } from '../redux/action';
import {  useNavigate } from 'react-router-dom';
import { authContext } from '../context/Authcontext';
import { useContext , useEffect , useState } from 'react';
import { axiosClient } from '../api/axios';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  useToasts } from 'react-toast-notifications';
export default function Watched() {
  const {authenticated}=useContext(authContext) 
  const [load,setLoad]=useState(false)
  const Navigate=useNavigate()
  const watchedMovies = useSelector(state => state.watched);
  const dispatch = useDispatch();
  const {addToast}= useToasts();

  useEffect(()=>{
    const getdata=async ()=>{
       try {
        setLoad(true)
           let response=await  axiosClient.get('/getwatched') 
             dispatch(setMoviesfromwatched(response.data.movies))
          setLoad(false)
       } catch (error) {
           console.log("Error");
       }
      }
      getdata()
 },[])

 const handledelete = async (movie) => {
  dispatch(RemoveMovieFromWatched(movie))
  axiosClient.get('/deletewatched/'+movie.reference)
  .then(res => alert(res.data.message)) 
  .catch(err => console.log(err));  
  addToast('this movie is deleted succefuly',{appearance: 'success',
  autoDismiss: true,})
 }
 


  useEffect( ()=>{
    if(!authenticated){
      Navigate('/')
   }},[authenticated])
  return (
    <div className='container'>
  <h4 className='text-light'>My Watched List</h4>
  <div className='row'>
    {load ? (
      <div className='col-12 d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
        <div className='text-light'><FontAwesomeIcon icon={faSpinner} spin style={{ width: '85%', height: '85%' }} /></div>
      </div>
    ) : (
      <>
        {watchedMovies.length > 0 ? (
          watchedMovies.map((movie) => (
            <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4' key={movie.id}>
              <div className='card' style={{ backgroundColor: 'rgb(23, 23, 53)' }}>
                <img src={`https://image.tmdb.org/t/p/w400${movie.poster}`} className='card-img-top' alt={movie.original_title} />
                <div className='card-body'>
                  <h3 className='card-title text-light'>{movie.title}</h3>
                  <p className='card-text text-light'>Year: {movie.year}</p>
                  <div className='d-flex justify-content-start'>
                    <button onClick={() => handledelete(movie)} className='btn btn-danger '>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='col-12'>
            <h1 className='text-secondary text-center'>No movies in your watched list</h1>
          </div>
        )}
      </>
    )}
  </div>
</div>

  );
}
