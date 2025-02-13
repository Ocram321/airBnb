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
            style={{ cursor: 'pointer' }}
        >
            {spot.previewImage ? (
                <img src={spot.previewImage} alt={spot.name} className="spot-image" style={{ cursor: 'pointer' }} />
            ) : (
                <div className="spot-no-image" style={{ cursor: 'pointer' }}>No Image Available</div>
            )}
            <div className="spot-info">
                <div className="spot-header">
                    <div className="spot-location" style={{ cursor: 'pointer' }}>{`${spot.city}, ${spot.state}`}</div>
                    <div className="spot-rating" style={{ cursor: 'pointer' }}>★{spot.avgRating ? parseFloat(spot.avgRating).toFixed(1) : 'New'}</div>
                </div>
                <div className="spot-price" style={{ cursor: 'pointer' }}>${spot.price}/night</div>
            </div>
            {showTooltip && (
                <div className="spot-tooltip" style={{ cursor: 'pointer' }}>
                    {spot.name}
                </div>
            )}
        </div>
    );
};
export default SpotCard;
