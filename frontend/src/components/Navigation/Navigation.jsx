
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css'
import Favicon from '../../../public/favicon.ico';

function Navigation({ isLoaded }) {
    const sessionUser = useSelector(state => state.session.user);
  
    return (
      <div>
        <div>
          <NavLink to="/"><img src={Favicon}/> Mario Castles</NavLink>
        </div>
        <div>
        {sessionUser && (
            <NavLink to="/spots/new" className="create-spot-link" data-testid='create-new-spot-button'>
              Create a New Spot
            </NavLink>
          )}
        </div>
        {isLoaded && (
          <div>
            <ProfileButton user={sessionUser} />
          </div>
        )}
      </div>
    );
  }
  
  export default Navigation;