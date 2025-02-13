
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css'
import Favicon from '../../images/favicon.ico';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className="navigation-container">
      <div style={{ cursor: 'pointer' }}>
        <NavLink to="/" className="logo">
          <img src={Favicon} alt="Logo" /> Mario Castles
        </NavLink>
      </div>
      <div style={{
        display: 'flex',
      }}>
      <div className="nav-links" style={{ cursor: 'pointer' }}>
        {sessionUser && (
          <NavLink to="/spots/new" className="create-spot">
            Create a New Spot
          </NavLink>
        )}
      </div>
      {isLoaded && (
        <div className="profile-container" style={{ cursor: 'pointer' }}>
          <ProfileButton user={sessionUser} />
        </div>
      )}
      </div>
    </div>
  );
}

export default Navigation;