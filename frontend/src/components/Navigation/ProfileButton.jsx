import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../LoginFormModal/LoginForm';
import SignupFormModal from '../SignUpFormModal/SignUpForm';
import { useNavigate, NavLink } from 'react-router-dom';

 
function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); 
    setShowMenu(!showMenu);
  };
  console.log(showMenu);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);
  const navigate = useNavigate();

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
    navigate('/')
  };

  return (
    <div style={{
      position: "relative"
    }}>
      <button onClick={toggleMenu} style={{
        marginTop: 0,
        cursor: 'pointer',
      }}>
        <FaUserCircle />
      </button>
      <div
        ref={ulRef}
        className="profile-dropdown"
        style={{
          display: showMenu ? "flex" : "none",
          flexDirection: 'column',
          position: 'absolute',
          top: 0,
          right: "100%",
          minWidth: 150,
          backgroundColor: "white",
          borderWidth: 2,
          borderColor: "black",
          borderStyle: "solid",
          borderRadius: 10,
          padding: 5,
          gap: 5,
          zIndex: 1,
        }}
      >
        {user ? (
          <>
            <div>Hello, {user.username}</div>
            <div>{user.email}</div>
            <div style={{
              width: '100%',
              borderBottom: '1px black solid',
            }}/>
            <NavLink to="/spots/current">Manage Spots</NavLink>
            <div style={{
              width: '100%',
              borderBottom: '1px black solid',
            }}/>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </>
        ) : (
          <>
            <OpenModalMenuItem
              itemText="Log In"
              onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalMenuItem
              itemText="Sign Up"
              onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default ProfileButton;