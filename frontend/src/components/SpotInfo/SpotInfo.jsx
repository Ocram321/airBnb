import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import { getInfoById } from '../../store/spot';
import { fetchReviews } from '../../store/review'
import ReviewsList from '../Reviews';
import OpenModalButton from '../OpenModalButton/OpenModal';
import PostReview from '../Reviews/AddReview';

import "./SpotInfo.css"



const SpotDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotInfo);
    const reviews = useSelector(state => state.reviews.reviews || []);
    const user = useSelector(state => state.session?.user);

    useEffect(() => {
        dispatch(getInfoById(id));
        dispatch(fetchReviews(id));
    }, [dispatch, id]);

    if (!spot || spot.id !== parseInt(id)) {
        return <div>Loading...</div>;
    }

    const {
        name,
        city,
        state,
        country,
        SpotImages = [],
        Owner = {},
        description,
        price,
    } = spot;

    const largeImage = SpotImages?.find(img => img.preview === true) || SpotImages?.[0];
    const smallImages = SpotImages ? SpotImages.slice(0, 4) : [];

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 'New';

    const numReviews = reviews.length;

    const canPostReview = user && Owner && Owner.id && !reviews.some(review => review.userId === user.id) && user.id !== Owner.id;

    return (
<div className="spot-details-container">
            <h1 className="spot-title">{name}</h1>
            <p className="spot-location">{city}, {state}, {country}</p>

            <div className="spot-images-container">
                {largeImage && (
                    <img className="large-image" src={largeImage.url} alt={`${name} Preview`} />
                )}
                <div className="small-images-container">
                    {smallImages.map(img => (
                        <img className="small-image" key={img.id} src={img.url} alt={`${name} Image ${img.id}`} />
                    ))}
                </div>
            </div>

            <hr className="separator" />
            
            <div className="spot-host-reserve-price">
                <div className="spot-host-info">
                    <div className="host-name">Hosted by {Owner.firstName || 'Unknown'} {Owner.lastName || 'User'}</div>
                    <p className="spot-description">{description}</p>
                </div>

                <div className="spot-reserve-box">
                    <div className="spot-price">${price} <span className="night-text">/night</span></div>
                    <div>
                        <h2 className="spot-rating">
                            <span>★</span> {avgRating}
                            {numReviews > 0 && (
                                <>
                                    <span className="dot-separator"> · </span>
                                    <span>{numReviews} {numReviews === 1 ? 'Review' : 'Reviews'}</span>
                                </>
                            )}
                        </h2>
                        <button className="reserve-button" onClick={() => alert('Feature coming soon')}>Reserve</button>
                    </div>
                </div>
            </div>
            <hr className="separator"/>

            <div className="reviews-section">
                <h2>
                    <span>★</span> {avgRating}
                    {numReviews > 0 && (
                        <>
                            <span className="dot-separator"> · </span>
                            <span>{numReviews} {numReviews === 1 ? 'Review' : 'Reviews'}</span>
                        </>
                    )}
                </h2>
                {canPostReview && (
                    <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<PostReview spotId={id} data-testid='review-form' />}
                    />
                )}

                <ReviewsList reviews={reviews} user={user} isOwner={user?.id === Owner?.id} />
            </div>
        </div>
    );
};


export default SpotDetails;