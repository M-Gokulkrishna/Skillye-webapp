import '../StyleSheets/DashBoard.css';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { setSearchValue } from '../ReduxStates/searchInputState';
import { FaAngleDoubleDown, FaAngleDoubleUp, FaArrowLeft, FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
// 
const DashBoard = () => {
  const NavigateTo = useNavigate();
  const dispatchInputValue = useDispatch();
  const [LogoutFlag, setLogoutFlag] = useState(false);
  const [whichFilter, setWhichFilter] = useState('Name-');
  const [DropDownClick, setDropDownClick] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('')
  const [ProfileClickFlag, setProfileClickFlag] = useState(false);
  // 
  useEffect(() => {
    if (ProfileClickFlag) {
      NavigateTo('/DashBoard/Profile');
    }
    else {
      if (localStorage.getItem('UserAccessToken')) {
        NavigateTo('/DashBoard/ProfileCards');
      }
    }
  }, [ProfileClickFlag]);
  // 
  function handleSearchInput(e) {
    setSearchInputValue(e.target.value);
  }
  return (
    <div className='DashBoard-Page'>
      <nav className="DashBoard-NavBar" data-aos='fade-down'>
        <div className='Logout-Icon' onClick={() => {
          setLogoutFlag(true);
          NavigateTo('/DashBoard/ProfileCards');
        }}>
          <FaSignOutAlt />
        </div>
        <div className='NavBarInput-Container' data-aos='fade-down' data-aos-duration="1200">
          <div className='Filter-Input' onClick={() => setDropDownClick(!DropDownClick)}>
            <FaAngleDoubleDown />
          </div>
          <input type="text" name="SearchInput" id="SearchInput" placeholder='Search skillye' onChange={(e) => handleSearchInput(e)} />
          <div className='Search-Input' onClick={() => dispatchInputValue(setSearchValue(whichFilter + searchInputValue))}>
            <FaSearch />
          </div>
          <div className='DropDown-Input' style={
            (DropDownClick) ?
              { transform: 'scaleY(1)' } :
              { transform: 'scaleY(0)' }}>
            <h6 className='DropDown-Filter' onClick={() => { setWhichFilter('Name-'); setDropDownClick(false); }} style={(whichFilter === 'Name-') ? { backgroundColor: 'antiquewhite' } : null}>Name Filter</h6>
            <h6 className='DropDown-Filter' onClick={() => { setWhichFilter('Skills-'); setDropDownClick(false); }} style={(whichFilter === 'Skills-') ? { backgroundColor: 'antiquewhite' } : null}>Skill Filter</h6>
            <div className='ArrowUp-Filter-Input' onClick={() => setDropDownClick(!DropDownClick)}>
              <FaAngleDoubleUp />
            </div>
          </div>
        </div>
        <div className='Profile-Icon' onClick={() => setProfileClickFlag(!ProfileClickFlag)}>
          {!ProfileClickFlag && <FaUser />}
          {ProfileClickFlag && <FaArrowLeft />}
        </div>
      </nav>
      {
        LogoutFlag &&
        <div className='LogoutConfirmation-Page'>
          <div className='LogoutConfirmation-Container'>
            <p>Are you sure to LogOut</p>
            <div>
              <span className='btn btn-primary' onClick={() => {
                localStorage.removeItem('UserAccessToken');
                NavigateTo('/LoginSignup');
              }}>Ok</span>
              <span className='btn btn-danger' onClick={() => setLogoutFlag(false)}>Cancel</span>
            </div>
          </div>
        </div>
      }
      <Outlet />
    </div>
  )
}

export default DashBoard;