const initialestate={
   watchlist:[],
   watched : [],
   details :{}
}

export const Moviereducer=(state=initialestate,action)=>{
    switch(action.type){
        case 'AddMovieToWatchList' :
        
                if (!state.watchlist.includes(action.payload.movie)) {
                     return {
                        ...state , watchlist:[...state.watchlist, action.payload.movie]
                        }
                }else{
                    alert('this movie already exict');
                };
       
            
        case  "RemoveMovieFromWatchList" :
         return {
             ...state,
             watchlist: state.watchlist.filter((movie) => movie.id !== action.payload.id)
         };
        case "AddMovieTomWatched" :
            return {
                ...state ,
                watchlist: state.watchlist.filter((movie) => movie.id !== action.payload.id) ,
                 watched : [...state.watched, action.payload ]
            }
        case "RemoveMovieFromWatched" :
            return {
                ...state , watched: state.watched.filter((movie) => movie.id !== action.payload.id )
            }
        case "setdatafromwatchlist" :
            return {
                ...state , watchlist : action.payload  
            }
        case 'setdatafromwatched':
            return {
                ...state , watched : action.payload 
            }
        case 'details' : 
            return {
                ...state , details:action.payload
            }
        default :
            return state;

}}