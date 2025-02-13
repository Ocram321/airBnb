import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserSpots } from '../../store/spot';
import '../SpotCard/SpotCard.css'
import { FaStar } from 'react-icons/fa';
import DeleteSpot from '../DeleteSpot';
import OpenModalButton from '../OpenModalButton/OpenModal';
import SpotCard from '../SpotCard/SpotCard';


const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userSpots = useSelector(state => state.spots.userSpots);
  const user = useSelector(state => state.session?.user);

  useEffect(() => {
    if (user) {
      dispatch(UserSpots());
    }
  }, [dispatch, user]);

  const handleTileClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  const onUpdateClick = (spotId) => {
    navigate(`/spots/${spotId}/edit`);
  };

  if (!userSpots.length) {
    return (
      <div>
        <h1>Manage Spots</h1>
        <button onClick={() => navigate('/spots/new')} >
          Create a New Spot
        </button>
      </div>
    );
  }

  return (
    <div >
      <h1>Manage Spots</h1>
      <button onClick={() => navigate('/spots/new')} >
        Create a New Spot
      </button>
      <div className='spots-container' >
        {userSpots.map((spot) => (
          <div
            key={spot.id}
          >
            <div onClick={() => handleTileClick(spot.id)}>
              <SpotCard spot={spot} />
            </div>
            <div >
              <button onClick={(e) => {
                e.stopPropagation()
                onUpdateClick(spot.id)
              }}>Update</button>

              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSpot spotId={spot.id} />}
                className="delete-button"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default ManageSpots