import React from 'react';
import {  RouterProvider } from 'react-router-dom';
import './App.css'
import router from './component/routes/router';
import { ToastProvider } from 'react-toast-notifications';

function App() {

  return (
    <div style={{ backgroundColor :'rgba(23, 23, 53)' }}>
    <ToastProvider>

    <RouterProvider router={router}/>
    </ToastProvider>
    </div>
  );
}

export default App;
