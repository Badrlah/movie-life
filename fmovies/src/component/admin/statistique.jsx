import React, { useEffect, useState } from 'react'
import { axiosClient } from '../api/axios'

function Statistique() {
    const [nbMovies,setnbMovies]=useState();
    const [nbUser,setnbUser]=useState();
    const [favMovie,setfavMovie]=useState();
    const [plusfav,setplusfav]=useState();
    const [plusaimer,setplusaimer]=useState();
    useEffect(()=>{ axiosClient.get('/static').then(res=> {setnbMovies(res.data.movies),
            setnbUser(res.data.user),
            setfavMovie(res.data.favori),
            setplusfav(res.data.plusfavori),
            setplusaimer(res.data.plusaimee)
        })},[])
       
         const plusfavTitle = plusfav && plusfav.title; 
         const plusaimerTitle = plusaimer && plusaimer.original_title;
         const plusaimerLike = plusaimer && plusaimer.nb_like;
  return (
    <div>
        <h2 className='text-warning text-center'>Statistisque</h2><br />
        <div className="container">
            <div className='row row-cols-1 row-cols-md-3 g-4'>
                <div className="col">
                    <div className="card bg-light h-100">
                        <div className="card-body">
                            <h5 className="card-title">Nombre des films</h5>
                            <p className="card-text text-primary">{nbMovies}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card bg-light h-100">
                        <div className="card-body">
                            <h5 className="card-title">Nombre de Utilisateurs</h5>
                            <p className="card-text text-primary">{nbUser}</p>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card bg-light h-100">
                        <div className="card-body">
                            <h5 className="card-title">Nombre des films aux favourites</h5>
                            <p className="card-text text-primary">{favMovie}</p>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <h4 className='text-light'>le film le plus favorite par les Utilisateurs : <span className='text-primary'>{plusfavTitle}</span></h4>
            <h4 className='text-light'>le film le plus aimée par les Utilisateurs : <span className='text-primary'>{plusaimerTitle}</span> avec nombre de like : <span className='text-primary'>{plusaimerLike}</span></h4>

        </div>
    </div>
  )
}

export default Statistique