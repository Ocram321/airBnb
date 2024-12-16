
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css'


function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
  
    return (
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
        {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-link" data-testid='create-new-spot-button'>
              Create a New Spot
            </NavLink>
          )}
        </li>
        {isLoaded && (
          <li>
            <ProfileButton user={sessionUser} />
          </li>
        )}
      </ul>
    );
  }
  
  export default Navigation;