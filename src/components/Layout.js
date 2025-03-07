import React from 'react'
import { Outlet, useNavigate } from 'react-router';
import { useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';



const Layout = () => {

  const navigate = useNavigate();
  useEffect(() => {
    const isLogin = localStorage.getItem('is_login');
    if (isLogin!=='1') {
      navigate('/login');
    }
  }, 
  []);
  return (
    <>
    <Header />
    <div className="v-row container">
      <Sidebar />
      <div className="v-col content">
        <Outlet />
      </div>
    </div>
    <Footer />
  </>
  )
}

export default Layout;
