import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useToasts } from 'react-toast-notifications';
import { useSelector } from 'react-redux';
import { authContext } from '../context/Authcontext';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
export default function DetailMovie() {
  const [genres, setGenres] = useState({});
  const [trailerKey, setTrailerKey] = useState('');
  const {authenticated}=useContext(authContext)
  const navigate=useNavigate()
 const film=useSelector(state => state.details);
  const voteAverage = film.vote_average ? film.vote_average : 'N/A';
  const {addToast}= useToasts();

  const currentUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        addToast('Link copied',{
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(err => {
        console.error('Échec de la copie du lien : ', err);
      });
  };
  
   useEffect(()=>{
     if(!authenticated){
       navigate('/')
     }
   },[])
  console.log(film);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=94c14418531c277ddc6fca0136c7013a`)
      .then(response => response.json())
      .then(genreData => {
        const genreMap = {};
        genreData.genres.forEach(genre => {
          genreMap[genre.id] = genre.name;
        });
        setGenres(genreMap);
   
      })
      .catch(error => console.error("Error:", error));
  }, []);

  useEffect(() => {
    const fetchTrailer = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${film.id}/videos?api_key=94c14418531c277ddc6fca0136c7013a`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setTrailerKey(data.results[0].key);
        } else {
          console.log("No trailer found for this movie.");
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      }
    };
    
    fetchTrailer();
  }, [film.id]);

  return (
    <div className='container'>
     <Link to={'/'} className='btn btn-info'>Back</Link>
      {film && (
        <div>
          <h3 className='titre text-warning'> More details about : <span className='text-info'>{film.original_title}</span></h3>
          <div className='row'>
         <div className='col-lg-5 col-md-12 col-sm-12'>
            <img src={`https://image.tmdb.org/t/p/w400${film.poster_path}`} style={{ width:'460px' }} alt={film.title} />
            </div>
            <div className='col-lg-6 col-md-12 col-sm-12'>
            
              <h2 className='text-light'>{film.original_title}</h2>
              <div>
              {film.genre_ids && (
  <p className='card-text text-light'>
    {JSON.parse(film.genre_ids).map(genreId => genres[parseInt(genreId, 10)]).join(' , ')}
  </p>
)}

           </div>
              <h3 className='text-light'>{film.release_date}</h3>
              <h4 className='text-light'>{film.original_language}</h4>
              <h4 className="text-light imdb-rating">
              <FontAwesomeIcon icon={faStar} className="star-icon" />{voteAverage}
                 </h4>
              <h3 className='text-warning'>overview</h3>
              <p className='text-light'>{film.overview}</p>
              <h3 className='text-warning'> Trailer </h3>
              {trailerKey ? (
  <div className="trailer">
    <iframe
      title="trailer"
      width="560"
      height="315"
      src={`https://www.youtube.com/embed/${trailerKey}`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
) : (
  <h1 className="text-light">No trailer for this film.</h1>
)}

            </div>
          </div></div>
      )}
         <br />
      <div >
      <button onClick={copyToClipboard} className="btn btn-primary">Copier le lien</button>
      
      <div style={{ padding:'8px' }} >
        <WhatsappShareButton url={currentUrl} title="Découvrez ce lien !" style={{ margin :'8px' }}>
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
        
        <FacebookShareButton url={currentUrl} quote="Découvrez ce lien !" style={{ margin :'8px' }}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        
        <TwitterShareButton url={currentUrl} title="Découvrez ce lien !" style={{ margin :'8px' }}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        
        <LinkedinShareButton url={currentUrl} summary="Découvrez ce lien !" style={{ margin :'8px' }}>
          <LinkedinIcon size={32} round />
        </LinkedinShareButton>
      </div>
    </div>
    </div>
  );
}
