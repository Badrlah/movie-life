import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosClient } from '../api/axios';
import { useToasts } from 'react-toast-notifications';
import './details.css'
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share';
import { FacebookIcon, TwitterIcon, LinkedinIcon, WhatsappIcon } from 'react-share';
export default function Details() {
  const [genres, setGenres] = useState({});
  const [trailerKey, setTrailerKey] = useState('');
  const { id }=useParams(); 
  const [detailmovie, setDetailMovie] = useState([]);
  const {addToast}= useToasts();

  const currentUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        addToast('Link copied', {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch(err => {
        console.error('Échec de la copie du lien : ', err);
      });
  };
  
  useEffect(() => {
    axiosClient.get(`/details/${id}`)
      .then((response) => {
        console.log("Details page response", response.data);
        setDetailMovie(response.data.movie);
      })
      .catch((error) => console.log(error));
  }, [id]);


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
        const response = await fetch(`https://api.themoviedb.org/3/movie/${detailmovie.reference}/videos?api_key=94c14418531c277ddc6fca0136c7013a`);
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
  }, [detailmovie.id]);

  return (
    <div className='container'>
     <Link to={'/home'} className='btn btn-info'>Back</Link>
      {detailmovie && (
        <div>
          <h3 className='titre text-warning'> More details about : <span className='text-info'>{detailmovie.title}</span></h3>
          <div className='content'>
            <img src={`https://image.tmdb.org/t/p/w400${detailmovie.poster}`}  style={{ width : '600px' }} alt={detailmovie.title} />
            <div className='info'>
              <h2 className='text-light'>{detailmovie.title}</h2>
              {detailmovie.genre && detailmovie.genre.length > 0 && (
  <p className='card-text text-light'>{detailmovie.genre.split(',').map(genreId => genres[parseInt(genreId, 10)]).join(', ')}</p>
)}

              <h3 className='text-light'>{detailmovie.year}</h3>
              <h4 className='text-light'>{detailmovie.langue}</h4>
              <h4 className='text-light'><FontAwesomeIcon icon={faStar} className="star-icon" />{detailmovie.vote}</h4>
              <h3 className='text-warning'>overview</h3>
              <p className='text-light'>{detailmovie.overview}</p>
              <h3 className='text-warning'> Trailer </h3>
              {trailerKey && (
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
              )}
            </div>
          </div>
        </div>

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
