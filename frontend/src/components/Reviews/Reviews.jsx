
const ReviewsList = ({ reviews = [] }) => {
    console.log('hY LOOK AT  THIS;', reviews)
    const date = (dateAdded) => {
        const date = new Date(dateAdded)
        const options = { year: 'numeric', month: 'long' };
        return date.toLocaleDateString('en-US', options);
    }

    return (
        <div>
            {reviews.map(review => (
                <li key={review.id}>
                    <div>{review.User ? review.User.firstName : 'Unknown User'}</div>
                    <div>{date(review.createdAt)}</div>
                    <p>{review.review}</p>
                </li>
            ))}
        </div>
    )
}

export default ReviewsList;