import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';


import { getInfoById } from '../../store/spot';
import { fetchReviews } from '../../store/review'
import ReviewsList from '../Reviews';



const SpotDetails = () => {
    const { id } = useParams(); 
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.spotInfo);
    const reviews = useSelector(state => state.reviews.reviews || []);
   

    useEffect(() => {
        dispatch(getInfoById(id));
        dispatch(fetchReviews(id));
    }, [dispatch, id]);

    const {
        name,
        city,
        state,
        country,
        SpotImages = [],
        Owner = {}, 
        description,
        price = 'N/A',
    } = spot;

    const totalStars = reviews.reduce((sum, review) => sum + review.stars, 0);
    const avgRating = reviews.length > 0 ? (totalStars / reviews.length).toFixed(1) : 'New';

    const numReviews = reviews.length;

    return (
        <div>
            <h1>{name}</h1>
            <h3>{city}, {state}, {country}</h3>
            <div>
                {SpotImages.map(img => (
                 <img key={img.id} src={img.url} alt={`${name} Image ${img.id}`}/>
                ))}
            </div>
            <div>Hosted By: {Owner.firstName} {Owner.lastName}</div>
            <div>{description}</div>
            <div>${price}</div>
            <span></span>
            <div>
                <h2>
                   * {avgRating} #Reviews: {numReviews}
                </h2>
                <ReviewsList reviews={reviews}/>
            </div>

           
        </div>
    )
}    

export default SpotDetails