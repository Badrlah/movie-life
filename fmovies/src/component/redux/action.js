export const AddMovieToWatchList = ({movie , authenticate}) => ({ type: "AddMovieToWatchList", payload:{ movie , authenticate }});
export const RemoveMovieFromWatchList = (movie) => ({ type: "RemoveMovieFromWatchList", payload: movie });
export const AddMovieTomWatched = (movie) => ({ type: "AddMovieTomWatched", payload: movie });
export const RemoveMovieFromWatched = (movie) => ({ type: "RemoveMovieFromWatched", payload: movie });
export const setMovies= (movies) => ({type:"setdatafromwatchlist" , payload: movies})
export const setMoviesfromwatched= (movies) => ({type:"setdatafromwatched" , payload: movies})
export const detailsMovie = (movie) => ({ type : 'details',payload : movie }) 

