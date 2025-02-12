import { useNavigate } from 'react-router-dom'
import './SpotCard.css'
import { useState } from 'react';

export const SpotCard = ({ spot }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/spots/${spot.id}`)
    }

    return (
        <div
            className='spot-card'
            onClick={handleClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{
                position: 'relative'
            }}
        >
            {spot.previewImage ? (
                <img src={spot.previewImage} alt={spot.name} className="spot-image" />
            ) : (
                <div>No Image Available</div>
            )}
            <div >
                <div >
                    <p >{`${spot.city}, ${spot.state}`}</p>
                    <div>★{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}</div>
                    <div >
                    </div>
                </div>
                <div>${spot.price}/night</div>
            </div>
            {showTooltip && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    backgroundColor: 'white',
                    border: 2,
                    borderColor: "black",
                    borderStyle: "solid",
                }}>
                    {spot.name}
                </div>
            )}
        </div>
    )
}

export default SpotCard
