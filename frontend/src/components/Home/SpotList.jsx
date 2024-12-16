import { useEffect } from "react";
import {useSelector, useDispatch} from 'react-redux';
import { getAllSpots } from "../../store/spot";
import SpotCard from "../SpotCard";



const SpotList = () => {
    const dispatch = useDispatch();
    const spots = useSelector(state => state.spots.spots || []); 
  
    useEffect(() => {
      dispatch(getAllSpots());  
    }, [dispatch]);
  
    return (
      <div className="spots-container" data-testid='spots-list'>
      {spots && spots.length > 0 ? (
      spots.map(spot => (
        <SpotCard key={spot.id} spot={spot} />
      ))
    ) : (
      <p>No spots available.</p>
    )}
      </div>
    );
  };
  
  export default SpotList;