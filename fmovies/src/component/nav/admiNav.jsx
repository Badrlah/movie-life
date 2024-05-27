// AdmiNav.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { authContext } from '../context/Authcontext';


function AdmiNav() {
  const { user, logout, authenticated,setAuthenticated } = useContext(authContext);

  const onLogout = async () => {
    await logout();
    setAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <div>
      <nav className='navbar navbar-expand-lg'>
        <div className='container'>
        
          <ul className='nav nav-underline'>
            <div className="d-flex align-items-center gap-3">
              {authenticated ? (
                <>
                  <li className='nav-item m-2'><Link className='nav-link text-light' to="/state"><strong>Statistics</strong></Link></li>
                  <li className='nav-item m-2'><Link className='nav-link text-light' to="/admin"><strong>Users</strong></Link></li>
                  <li className="nav-link text-info m-2">{user?.name}</li>
                  <button className="btn btn-primary me-3" onClick={onLogout}>Logout</button>
                </>
              ) : (
                <>
                  <Link to='/login' className="btn btn-link text-info px-3 me-2">Login</Link>
                  <Link to='/signup' className="btn btn-primary me-3">Sign Up</Link>
                </>
              )}
            </div>
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default AdmiNav;
