import { useNavigate } from 'react-router-dom'
import './SpotCard.css'

export const SpotCard = ({ spot }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/spots/${spot.id}`)
    }

    return (
        <div onClick={handleClick} className='spot-card'>
            {spot.previewImage ? (
                <img src={spot.previewImage} alt={spot.name} className="spot-image" />
            ) : (
                <div>No Image Available</div>
            )}
            <div >
                <div >
                    <p >{`${spot.city}, ${spot.state}`}</p>
                    <div >

                    ★{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}

                    </div>
                </div>
                <div>${spot.price}/night</div>
            </div>
        </div>
    )
}

export default SpotCard
