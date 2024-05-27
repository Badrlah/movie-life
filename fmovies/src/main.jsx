import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Authcontext from './component/context/Authcontext.jsx';
import { Provider } from 'react-redux';
import { store } from './component/redux/store.js';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>

    <Authcontext>
      <Provider store={store}>
        <App />
      </Provider>
    </Authcontext> 
  </React.StrictMode>
)
