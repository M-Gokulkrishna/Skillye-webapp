import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const NavigateTo = useNavigate();
  const AccessToken = localStorage.getItem('UserAccessToken') || undefined;
  // 
  useEffect(() => {
    if (AccessToken) {
      return async () => {
        const VerifyAccessToken = await axios.get('http://localhost:8080/VerifyToken', {
          headers: {
            'Authorization': `Bearer ${AccessToken}`
          }
        });
        if (VerifyAccessToken.data) {
          localStorage.setItem('UserAccessToken', VerifyAccessToken.data?.RefreshToken)
          setTimeout(() => {
            if (VerifyAccessToken.data?.VerifiedUser?.isProfileUpdated && navigator.onLine) {
              NavigateTo('/DashBoard/ProfileCards');
            }
          }, 1010);
        }
      }
    }
  }, []);
  return (
    <div className="LandingPage-Containers">
      <div className='bg-BigCircle'>
        <div className='bg-InnerCircle' style={{ '--OffsetX': '0%', '--OffsetY': '0%' }}></div>
        <div className='bg-InnerCircle' style={{ '--OffsetX': '70%', '--OffsetY': '0%' }}></div>
        <div className='bg-InnerCircle' style={{ '--OffsetX': '0%', '--OffsetY': '70%' }}></div>
        <div className='bg-InnerCircle' style={{ '--OffsetX': '70%', '--OffsetY': '70%' }}></div>
      </div>
      <div className='LandingPage-Container' data-aos='zoom-in-down'>
        <h1 className='text-light'>Welcome, Skillye</h1>
        <br />
        <button className='btn shadow' style={{ backgroundColor: 'springgreen' }} onClick={() => NavigateTo('/LoginSignup')}>Let's get In</button>
      </div>
    </div>
  )
}

export default LandingPage