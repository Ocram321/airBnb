import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import { getInfoById } from '../../store/spot';
import { fetchReviews } from '../../store/review'
import ReviewsList from '../Reviews';
import OpenModalButton from '../OpenModalButton/OpenModal';
import PostReview from '../Reviews/AddReview';



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
    } = spot;

    const largeImage = SpotImages?.find(img => img.preview === true) || SpotImages?.[0];
    const smallImages = SpotImages ? SpotImages.filter(img => !img.preview).slice(0, 4) : [];

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 'New';

    const numReviews = reviews.length;

    const canPostReview = user && Owner && Owner.id && !reviews.some(review => review.userId === user.id) && user.id !== Owner.id;

    console.log(Object.entries(user), Owner, reviews)

    return (
        <div >
            <h1>{name}</h1>
            <p>{city}, {state}, {country}</p>


            <div>
                {largeImage && (
                    <img src={largeImage.url} alt={`${name} Preview`} />
                )}
                <div >
                    {smallImages.map(img => (
                        <img key={img.id} src={img.url} alt={`${name} Image ${img.id}`} />
                    ))}
                </div>
            </div>

            <hr className="separator" />

            <div>
                <div>
                    <div>
                        <p>Hosted by {Owner.firstName || 'Unknown'} {Owner.lastName || 'User'}</p>
                    </div>
                    <div>
                        <p>{description}</p>
                    </div>
                </div>
            </div>

            <div >
                <h2>
                    <span>★</span> {avgRating}
                    {numReviews > 0 && (
                        <>
                            <span > · </span>
                            <span>{numReviews} {numReviews === 1 ? 'Review' : 'Reviews'}</span>
                        </>
                    )}
                </h2>

                {canPostReview && (
                    <OpenModalButton
                        buttonText="Post Your Review"
                        modalComponent={<PostReview spotId={id}
                            data-testid='review-form' />}
                    />
                )}


                <ReviewsList reviews={reviews} user={user} isOwner={user?.id === Owner?.id} />
            </div>
        </div>
    );
};

export default SpotDetails;