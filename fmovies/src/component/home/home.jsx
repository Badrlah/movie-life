import React , {useContext, useEffect , useState} from 'react'
import './home.css'
import { useDispatch, useSelector } from 'react-redux';
import { AddMovieTomWatched, RemoveMovieFromWatchList ,setMovies } from '../redux/action';
import { axiosClient } from '../api/axios';
import { authContext } from '../context/Authcontext';
import {  Link, useNavigate } from 'react-router-dom';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  useToasts } from 'react-toast-notifications';
 function Watchlist() {
    const {authenticated}=useContext(authContext) 
    const Navigate=useNavigate()
    const [load,setLoad]=useState(false)
    const movie=useSelector(state=>state.watchlist)
    const dispatch=useDispatch();
    const {addToast}= useToasts();
    const handledelete = async (item) => {
     dispatch(RemoveMovieFromWatchList(item))
     axiosClient.get('/deletewatchlist/'+item.reference)
     .then(res => console.log(res.data.message)) 
     .catch(err => console.log(err)); 
     addToast('this movie is deleted succefuly',{appearance: 'success',
     autoDismiss: true,})
    }

   useEffect(()=>{
      const getdata=async ()=>{
         try {
          setLoad(true);
             let response=await  axiosClient.get('/watchlist') 
               dispatch(setMovies(response.data.movies))
            setLoad(false)
         } catch (error) {
             console.log("Error");
         }
        }
        getdata()
   },[])
   console.log(movie);
 const addMovieToWatched =async (movieItem)=>{
     let response=await  axiosClient.get('/watched/'+movieItem.id)
     dispatch(AddMovieTomWatched(movieItem))
     addToast(response.data.message,{appearance: 'success',
     autoDismiss: true,})
 }
 
console.log(authenticated);
   return (
    <>
    <div className='container'>
      <div className='head'>
        <h3 className='text-light'>My Watchliste</h3>
        <h4 className='text-info'> Movies: {movie.length}</h4>
      </div>
      <div className='row'>
        {load ? (
          <div className='col-12 d-flex justify-content-center align-items-center' style={{ minHeight: '100vh' }}>
            <div className='text-light d-flex justify-content-center align-items-center'><FontAwesomeIcon icon={faSpinner} spin style={{ width: '85%', height: '85%' }} /></div>
          </div>
        ) : (
          <>
            {movie.length > 0 ? (
              movie.map((movieItem) => (
                <div className='col-12 col-sm-6 col-md-4 col-lg-3 mb-4' key={movieItem.id}>
                  <div className='card' style={{ backgroundColor: 'rgb(23, 23, 53)' }}>
                    <Link className='nav-link' to={`/details/${movieItem.id}`}>
                      <img src={`https://image.tmdb.org/t/p/w500${movieItem.poster}`} className='card-img-top' alt={movieItem.title} />
                    </Link>
                    <div className='card-body'>
                      <h3 className='card-title text-light'>{movieItem.title}</h3>
                      <p className='card-text text-light'>Year: {movieItem.year}</p>
                      <div className='d-flex justify-content-between'>
                        <button onClick={() => handledelete(movieItem)} className='btn btn-danger'>Delete</button>
                        <button onClick={() => addMovieToWatched(movieItem)} className='btn btn-info'>Add to Watched</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className='col-12'>
                <h1 className='text-secondary text-center'>No movies in your list, add some</h1>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  </>
  
  )
}


export default Watchlist;