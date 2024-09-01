import './App.css';
import Aos from 'aos';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import DashBoard from './Pages/DashBoard.jsx';
import { FaTimes, FaUndo } from 'react-icons/fa';
import LandingPage from './Pages/LandingPage.jsx';
import { toast, ToastContainer } from 'react-toastify';
import DetailsForm from './Components/DetailsForm.jsx';
import ProfileCard from './Components/ProfileCard.jsx';
import LoginSignup from './Components/LoginSignup.jsx';
import ProfileCards from './Components/ProfileCards.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// 
function App() {
  const [LoadingState, setLoadingState] = useState(false);
  const [isOnline, setOnlineState] = useState(navigator.onLine);
  const LoaderState = useSelector(state => state.LoaderStateFlag.flag);
  const ToastContent = useSelector(state => state.ToastState.ToastValue);
  useEffect(() => {
    Aos.init({
      duration: 900,
    });
    // window.addEventListener('contextmenu', (e)=>{
    //   e.preventDefault();
    // });
  }, []);
  // 
  function checkNetwork() {
    setOnlineState(navigator.onLine);
  }
  // 
  useEffect(() => {
    const NetworkTimer = setInterval(() => {
      checkNetwork();
    }, 1000 * 3);
    return () => {
      clearInterval(NetworkTimer);
    }
  }, [isOnline])
  // 
  useEffect(() => {
    setLoadingState(LoaderState);
  }, [LoaderState]);
  // 
  useEffect(() => {
    switch (ToastContent.State) {
      case 'Error':
        toast.error(ToastContent.Message);
        break;
      case 'Success':
        toast.success(ToastContent.Message);
        break;
    }
  }, [ToastContent]);
  // 
  return (
    <div className='AppMain-Layout'>
      <svg viewBox="0 0 1000 320">
        <path fill="deepskyblue" d="M0,288L26.7,293.3C53.3,299,107,309,160,293.3C213.3,277,267,235,320,229.3C373.3,224,427,256,480,245.3C533.3,235,587,181,640,144C693.3,107,747,85,800,80C853.3,75,907,85,960,80C1013.3,75,1067,53,1120,69.3C1173.3,85,1227,139,1280,144C1333.3,149,1387,107,1413,85.3L1440,64L1440,0L1413.3,0C1386.7,0,1333,0,1280,0C1226.7,0,1173,0,1120,0C1066.7,0,1013,0,960,0C906.7,0,853,0,800,0C746.7,0,693,0,640,0C586.7,0,533,0,480,0C426.7,0,373,0,320,0C266.7,0,213,0,160,0C106.7,0,53,0,27,0L0,0Z"></path>
      </svg>
      {
        LoadingState &&
        <div className='Loading-Page'>
          <div className='Loader'></div>
          <p>Loading ! . . .</p>
        </div>
      }
      {
        <div className='this-Toast-Container'>
          <ToastContainer />
        </div>
      }
      {
        !isOnline &&
        <div className='Network-Page'>
          <div className="Network-Container" data-aos='zoom-out'>
            <div className='Network-Icons'>
              <FaTimes />
            </div>
            <br />
            <p>You're Offline</p>
            <br />
            <div className='Network-Icons' onClick={() => setOnlineState(true)}>
              <FaUndo />
            </div>
          </div>
        </div>
      }
      <BrowserRouter>
        <Routes>
          <Route index element={isOnline && <LandingPage />} />
          <Route path='/LoginSignup' element={isOnline && <LoginSignup />} />
          <Route path='DashBoard' element={isOnline && <DashBoard />}>
            <Route path='Profile' element={isOnline && <ProfileCard />} />
            <Route path='ProfileCards' element={isOnline && <ProfileCards />} />
          </Route>
          <Route path='/DetailsForm' element={isOnline && <DetailsForm />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App