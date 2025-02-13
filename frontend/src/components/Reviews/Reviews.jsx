
import OpenModalButton from '../OpenModalButton/OpenModal';
import DeleteReview from './DeleteReview';
import UpdateReview from './UpdateReview'; 

const ReviewsList = ({ reviews = [], user, isOwner, spotId  }) => {

    const date = (dateAdded) => {
        const date = new Date(dateAdded)
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div>

      {reviews.length > 0 ? (
        <ul >
          {reviews.map(review => (
            <li key={review.id} >
              <div className="review-header">
                <strong>{review.User ? review.User.firstName : 'Unknown User'}</strong>
                <span >{date(review.createdAt)}</span>
              </div>
              <p >{review.review}</p>

              
              {user?.id === review.userId && (
                <div className="review-actions">
                  <OpenModalButton 
                    buttonText="Update"
                    modalComponent={<UpdateReview review={review} spotId={spotId} />}
                  />

                  <OpenModalButton 
                    buttonText="Delete"
                    modalComponent={<DeleteReview reviewId={review.id} />}   
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        !isOwner && user && (
          <p className="no-reviews-message">Be the first to post a review!</p>
        )
      )}
    </div>
  );
};

export default ReviewsList;