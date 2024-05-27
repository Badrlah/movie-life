import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';  
import { authContext } from '../context/Authcontext';
import { useToasts } from 'react-toast-notifications';
import styled from 'styled-components';
import { FaArrowAltCircleUp } from 'react-icons/fa'
import { detailsMovie } from '../redux/action';
import { axiosClient } from '../api/axios';
import { UserApi } from '../services/User';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons"; 
import { faStar as fasStar } from "@fortawesome/free-solid-svg-icons"; 
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import './latest.css';
import { Pagination } from 'react-bootstrap';

import useDebounceHook from './useDebounceHook[1]';


export default function LatestMovies() {
  const { authenticated ,user,setUser} = useContext(authContext);
  const [Films, setFilms] = useState([]);
  const [Movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [genres, setGenres] = useState({});
  const [srch, setsrch] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [likes, setLikes] = useState([]);
  const [isLiked, setIsLiked] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [trendingMovies, setTrendingMovies] = useState([]); 
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [showHey, setShowHey] = useState([]);
  
  const {sendMovie}=useContext(authContext)
  const dispatch = useDispatch();
  const {addToast}= useToasts();
  const Navigate = useNavigate();

  useEffect(() => {
    if (authenticated){
     UserApi.getUser().then((data)=>
        setUser(data.data)    
    )}
    
  } ,[authenticated])
  useEffect(() => {
      if ( user && user.role !== "user") {
        Navigate("/admin");
      } 
  }, [user]);
  
  const [selectedType, setSelectedType] = useState('all');



  const fetchMovies = (type) => {
    axiosClient.get(`/getall?type=${type} `)
      .then(res => {
        if (res.data) {
          if (Array.isArray(res.data.movies.data)) {
              if (type === 'all') {
                sortMoviesByReleaseDate(res.data.movies.data);
              } else if (type === 'trending') {
                setTrendingMovies(res.data.movies.data);
                console.log(res.data.movies.data);
              }
            
             if (res.data.movieliked){
             setIsLiked(res.data.movieliked)
             }
            const data = res.data.movies.data;
            const likesMap = [];
            const heylike=[];
            for (const movie of data) {
              likesMap[movie.id] = movie.nb_like; 
              heylike[movie.id] = false ;  
            }
            setLikes(likesMap);
            setShowHey(heylike);
          } else {
            console.error("res.data.movies n'est pas un tableau.");
          }
        } else {
          console.error("La réponse n'a pas les données attendues.");
        }
      })
      .catch(error => {
        console.error("Une erreur s'est produite lors de la récupération des données:", error);
      });
  
}
  
const handleSelectType = (event) => {
  setSelectedType(event.target.value);
  fetchMovies(event.target.value);
};

  // pour la recherche des movies
  const { search } = useDebounceHook(srch)  ;
   useEffect(() => {
       axiosClient.get(`/moviesearch?searchTerm=${search}`).then((res) => {
      if (res.data) {
        if (Array.isArray(res.data.movies)) {
          setMovies(res.data.movies);
          setIsLiked(res.data.movieliked);
          const data = res.data.movies;
          const likesMap = [];
          for (const movie of data) {
            likesMap[movie.id] = movie.nb_like;  
             
          }
          setLikes(likesMap);
        } else {
          console.error("res.data.movies n'est pas un tableau.");
        }
      } else {
        console.error("La réponse n'a pas les données attendues.");
      }
    })  
    .catch(error => {
      console.error("Une erreur s'est produite lors de la récupération des données:", error);
     });
   }, [search]);

   // pour fetcher les genres de films
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

  // trier les films par la date de sortie 
  const sortMoviesByReleaseDate = (data) => {
    if (Array.isArray(data)) { 
      const sortedMovies = [...data].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        return dateB - dateA;
      });
      setFilms(sortedMovies);
      setShowHey(sortedMovies);
      
    } else {
      console.error('Data is not iterable:', data);
    }
  };

  // afficher les films en fonction de la page
  useEffect(() => {
    axiosClient.get(`/getall?page=${currentPage}`)
      .then(response => {
         
       setFilms(response.data.movies.data); 
        setTotalPages(response.data.movies.last_page); 
      })
      .catch(error => {
        console.error('Error fetching movies:', error);
      });
  }, [currentPage]); 


  // ajouter un film au favourite
  const addMovieToWatchlist = async (movie) => {
    try {
      const authenticate = authenticated;
      const {status}=await sendMovie({ reference: movie.id,
         title: movie.original_title,
          year: movie.release_date ,
           poster : movie.poster_path ,
           genre : JSON.stringify(movie.genre_ids),
            langue : movie.original_language ,
             overview: movie.overview ,
              vote: movie.vote_average,
              like : movie.nb_like
          });
      addToast('Movie added successfully to your watchlist', {
        appearance: 'success',
        autoDismiss: true,
      });
      if(status==200){
        const ref=movie.id;
        const updatedFavorites = [...favoriteMovies, {reference:ref}];
          setFavoriteMovies(updatedFavorites);
      }

    } catch (error) {
      console.log(error.response);
      if ( error.response.status === 401 ){
        addToast("please login to add movie in your watchlist", { appearance: 'error' });
      }
      if ( error.response.status === 400 ){
        addToast(error.response.data.error, { appearance: 'error' });
      }
    }
  };
  const removeFromWatchList=(item)=>{
    const deletee=favoriteMovies.find((favMovie) => favMovie.reference == item.id)
     axiosClient.get('/deletewatchlist/'+deletee.reference)
     .then(res => 
       {if(res.status==200){
       const updatedFavorites = favoriteMovies.filter((favMovie) => favMovie.reference !== item.id);
       setFavoriteMovies(updatedFavorites);
       addToast(res.data.message,{appearance: 'success'})
       }}
     ) 
    .catch(err => console.log(err)); 
  }


// gestion de l'etoile pour favourite 
   useEffect(()=>{
     const getdata=async ()=>{
        try {
            let response=await  axiosClient.get('/watchlist') 
              setFavoriteMovies(response.data.movies)
        } catch (error) {
            console.log("Error");
        }
       }
       getdata()
      
  },[])
 const isMovieFavorite = (movie) => favoriteMovies.some((favMovie) => favMovie.reference == movie.id);
 const handleClickStar = (movie) => {
     const isFavorite = isMovieFavorite(movie);
     if (isFavorite) {
      removeFromWatchList(movie);
     } else {
      addMovieToWatchlist(movie); 
     }
 };


  // scroll 
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
  
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };
   window.addEventListener('scroll', toggleVisibility);
  
// detail film (redux)
  const handleClick = (movie) => {
    console.log(authenticated);
    if (authenticated){
        dispatch(detailsMovie(movie));}
    else{
      Navigate('/')
      addToast("Please login to see the details",{appearance: 'warning'})

    };
};

// filtrer les flims par le genre
const handleSelectAllGenres = (e) => {
  if (e.target.checked) {
    setSelectedGenres(Object.keys(genres));
  } else {
    setSelectedGenres([]);
  }
};  

const handleGenreChange = (e, id) => {
  const checked = e.target.checked;
  setSelectedGenres(prevSelectedGenres => {
    if (checked) {
      return [...prevSelectedGenres, id];
    } else {
      return prevSelectedGenres.filter(genreId => genreId !== id);
    }
  });
};
//const filteredMoviesTr = selectedType === 'trending' ? trendingMovies : Films;

useEffect(()=>{
  if(selectedType=='trending'){
    setFilms(trendingMovies)
  }else
  {
    setFilms([])
  }
},[selectedType,trendingMovies])



useEffect(() => {
  let moviesToShow = selectedGenres.length > 0 ? 
    Films.filter(movie => selectedGenres.some(selectedGenre => movie.genre_ids.includes(parseInt(selectedGenre)))) 
    : Films;
  
  setFilteredMovies(moviesToShow); // Set filteredMovies state
}, [Films, selectedGenres]);



// changer la page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
   };


  // gestion de like
  const addlike = (movie) => {
    axiosClient.post('/addlike/' + movie.id)
      .then((res) => {
        setLikes(prevLikes => {
          const updatedLikes = { ...prevLikes };
          updatedLikes[movie.id] = res.data.nb_like;
          return updatedLikes;
        });
        setIsLiked([...isLiked,movie]);
        console.log(res.data.userMovies);
      })
      .catch((error) => {
        addToast("Please login to like a movie",{appearance: 'warning'})
      });
  };

  const removelike=(movie)=>{
    axiosClient.post('/removelike/'+ movie.id)
    .then((res)=>{
      setLikes(prevLikes => {
        const updatedLikes = { ...prevLikes };
        updatedLikes[movie.id] = res.data.nb_like;
        return updatedLikes;
      });
      setIsLiked( isLiked.filter(movies => movies.id!==movie.id));
    //  console.log(res.data.userMovies);

    }).catch((error) => {
      addToast(error);
    });
  }
  

  const isMovieLikes = (movie) => {
    return isLiked && isLiked.length > 0 && isLiked.some((likedmovie) => likedmovie.id === movie.id);
  };
  const handleLikes = (movie) => {
    const islike = isMovieLikes(movie);
    if (!islike) {
      addlike(movie);
    } else {
      removelike(movie);
    }
  };
  
  
const handleMouss=(id)=>{
  
  setShowHey(prevLikes =>{
    const update={...prevLikes}
    update[id]=!update[id]
    return update
  });
}


  
  return (
<>
    <div className='container' style={{ backgroundColor :'rgb(23,23,53)' }}>
    <div className='container'>
      <div className='row'>
         <div className='col'>
          <div className="input-group mb-3">
             <label className='input-group-text ' htmlFor="selectType">Select Movie Type:</label>
             <select id="selectType" className="form-select" value={selectedType} onChange={handleSelectType} > 
              <option value="trending">Trending</option>
              <option value="all">All Movie</option>
            </select> 
          </div>
        </div> 
        <div className='col'>
          <div className="input-group mb-3">
            <input type='text' className='form-control' placeholder='Search for a movie' value={srch} onChange={(e) => setsrch(e.target.value)} />
          </div>
          </div>
      </div>
    </div>


      <div>
        <div className='dropdown'>
          <button className='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-bs-toggle='dropdown' aria-expanded='false'>
            Select Genres
          </button>
          <div className='dropdown-menu' style={{ backgroundColor : 'rgb(23, 23, 53)' }} aria-labelledby='dropdownMenuButton'>
            <ul className='row '>
            <li className='list-group-item gap-2 '>
              <input className='form-check-input' type='checkbox' checked={selectedGenres.length === Object.keys(genres).length} onChange={handleSelectAllGenres} />
              <label className='form-check-label text-light' htmlFor='selectAllGenres'>Select All</label>
            </li>
          
            {Object.entries(genres).map(([id, name]) => (
              <li key={id} className='col-6 col-sm-4 col-md-3 list-group-item'>
                <div className="d-flex align-items-center gap-2 ">
                <input className='form-check-input' type='checkbox' id={id} value={id} checked={selectedGenres.includes(id)} onChange={(e) => handleGenreChange(e, id)} />
                <label className='form-check-label text-light' htmlFor={id}>{name}</label>
                </div> 
              </li>
            ))}
            </ul>
          </div>
        </div>
      </div>
<br />

<div className='row row-cols-1 row-cols-md-4 g-4'>
  {search ? (
    Movies.length > 0 ? (
      Movies.map((movie) => (
        <div key={movie.id} className='col'>
          <div className='card' style={{ backgroundColor: 'rgb(23, 23, 53)' }}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} className='card-img-top' alt={movie.original_title} />
            <div className='card-body'>
              <h5 className='card-title text-light'>{movie.original_title}</h5>
              <p className='card-text text-light'>Year: {movie.release_date}</p>
              {movie.genre_ids && (
                <p className='card-text text-light'>
                  {JSON.parse(movie.genre_ids).map(genreId => genres[parseInt(genreId, 10)]).join(' ')}
                </p>
              )}
             <div className="d-flex justify-content-between align-items-center">
             <FontAwesomeIcon
   onClick={() => handleClickStar(movie)}
      icon={isMovieFavorite(movie) ? fasStar : farStar}
      color={isMovieFavorite(movie) ? 'yellow' : 'white'}
    
      style={{ width:'30px' ,height :'30px', transition: 'transform 0.3s ease, color 0.3s ease' }} 
      className="btn1"
    />

  <button className="btn btn-outline-info mr-2" onClick={() => handleClick(movie)}>
    <Link className="nav-link text-white" to="/detailMovie">More Details</Link>
  </button>
    <div style={{ display : 'flex' }}>
      <FontAwesomeIcon
        onClick={() => handleLikes(movie)}
        key={movie.id}
        icon={faHeart}
        style={{
          color: isMovieLikes(movie) ? 'red' : (showHey ?  'red' : 'gray'),
          cursor:'pointer',
          width: '25px',
          height: '25px',
        }}
        
        onMouseEnter={() => setShowHey(true)}
        onMouseLeave={() => setShowHey(false)}
      />
      <span className="text-light">{likes[movie.id]}</span>
   </div>
   
            </div>
            </div>
          </div>
        </div>
      ))
    ) : (
      <h1 className='text-light'>Not found</h1>
    )
  ) : (
    <>
    {filteredMovies.map((movie) => (
      <div key={movie.id} className='col'>
        <div className='card' style={{ backgroundColor: 'rgb(23, 23, 53)' }}>
          <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} className='card-img-top' alt={movie.original_title} />
          <div className='card-body'>
            <h5 className='card-title text-light'>{movie.original_title}</h5>
            <p className='card-text text-light'>Year: {movie.release_date}</p>
            {movie.genre_ids && (
              <p className='card-text text-light'>
                {JSON.parse(movie.genre_ids).map(genreId => genres[parseInt(genreId, 10)]).join(' ')}
              </p>
            )}
    <div className="d-flex justify-content-between align-items-center">

    <FontAwesomeIcon
   onClick={() => handleClickStar(movie)}
      icon={isMovieFavorite(movie) ? fasStar : farStar}
      color={isMovieFavorite(movie) ? 'yellow' : 'white'}
    
      style={{ width:'30px' ,height :'30px', transition: 'transform 0.3s ease, color 0.3s ease' }} 
      className="btn1"
    />

  <button className="btn btn-outline-info mr-2" onClick={() => handleClick(movie)}>
    <Link className="nav-link text-white" to="/detailMovie">More Details</Link>
  </button>
    <div style={{ display : 'flex' }}>
      <FontAwesomeIcon
        onClick={() => handleLikes(movie)}
        key={movie.id}
        icon={faHeart}
        style={{
          color: isMovieLikes(movie) ? 'red' : (showHey[movie.id] ?  'red' : 'gray'),
          cursor:'pointer',
          width: '25px',
          height: '25px',
        }}
        
        onMouseEnter={() => handleMouss(movie.id)}
        onMouseLeave={() => handleMouss(movie.id)}
      />
      <span className="text-light">{likes[movie.id]}</span>
   </div>
</div>

          </div>
        </div>
      </div>))}
   </>
)}
  
</div>

      
      <Paginate
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
    
   <Button>
      <FaArrowAltCircleUp   onClick={scrollToTop}
      style={{ display: isVisible ? 'block' : 'none' }}/>
  </Button>
    </>
  );
}

const Button=styled.button`
  position: fixed;  
   right: 20px; 
   bottom: 40px; 
   font-size: 3rem; 
   z-index: 1; 
   cursor: pointer; 
   color:blue;
   background-color:transparent;

`;



function Paginate({ currentPage, totalPages, handlePageChange }) {
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    let startPage, endPage;

    if (totalPages <= maxPagesToShow) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= Math.floor(maxPagesToShow / 2)) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + Math.floor(maxPagesToShow / 2) >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - Math.floor(maxPagesToShow / 2);
        endPage = currentPage + Math.floor(maxPagesToShow / 2);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers.map((page) => (
      <Pagination.Item
        key={page}
        active={page === currentPage}
        onClick={() => handlePageChange(page)}
      >
        {page}
      </Pagination.Item>
    ));
  };

  return (
    <div className="d-flex justify-content-center mt-4">
      <Pagination>
        {currentPage > 1 && (
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
        )}
        {currentPage > 5 && <Pagination.Ellipsis />}
        {renderPageNumbers()}
        {currentPage < totalPages - 4 && <Pagination.Ellipsis />}
        {currentPage < totalPages && (
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        )}
      </Pagination>
    </div>
  );
}

