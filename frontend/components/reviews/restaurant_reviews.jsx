import React from 'react';
import RestaurantReviewItem from './restaurant_review_item';

class RestaurantReviews extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getRestaurantReviews(this.props.restaurant.id);
    }


    // sort by newest review creation date, then by alphbaetical order
    sortReviewsByNewest(reviewsArr) {
        return reviewsArr.sort((a, b) =>
            a.created_at < b.created_at ? 1 : a.created_at === b.created_at ? (a.username > b.username ? 1 : -1) : -1);
    }

    renderUserReview(userReview) {
        return (
                    <>
                        {
                            userReview.map(review => 
                                <RestaurantReviewItem
                                    key="user" 
                                    review={review}
                                    currentUser={this.props.currentUser}/>
                            )
                        }
                    </>
        )
    }

    renderOtherReviews(otherReviews) {
        return (
                    <> 
                        {
                            otherReviews.map( (review, idx) => 
                                <RestaurantReviewItem
                                    key={`reviews-${idx}`} 
                                    review={review}/>)
                        }
                    </>
        )
    }

    createUserReview() {
        if (this.props.currentUser.visited_restaurant_ids.includes(this.props.restaurant.id)) {
            return <span>Create User Review Container</span>;
        } else {
            return '';
        }
    }

    render () {
        let renderedUserReviewComponent;
        let renderedReviewListComponent;
        let reviewsArray;
        const noReviews = <p className='no-reviews'>This restaurant has not yet been reviewed.</p>

        if (!this.props.currentUser) {
            if (this.props.reviews.length > 0) {
                reviewsArray = this.sortReviewsByNewest(this.props.reviews);
                renderedReviewListComponent = this.renderOtherReviews(reviewsArray);

            } else {
                renderedReviewListComponent = noReviews;
            }
        } else {
            let userReview = this.props.reviews.filter(review => review.user_id === this.props.currentUser.id);
            let otherReviews = this.props.reviews.filter(review => review.user_id !== this.props.currentUser.id);

            if (userReview.length > 0 && otherReviews.length > 0) {
                reviewsArray = this.sortReviewsByNewest(otherReviews);

                renderedUserReviewComponent = this.renderUserReview(userReview);
                renderedReviewListComponent = this.renderOtherReviews(reviewsArray);

            } else if (userReview.length > 0 && otherReviews.length === 0) {

                renderedUserReviewComponent = this.renderUserReview(userReview);
                renderedReviewListComponent = '';

            } else if (userReview.length === 0 && otherReviews.length > 0) {
                reviewsArray = this.sortReviewsByNewest(otherReviews);

                renderedUserReviewComponent = this.createUserReview();
                renderedReviewListComponent = this.renderOtherReviews(reviewsArray);
            } else if (userReview.length === 0 && otherReviews.length === 0) {

                renderedUserReviewComponent = this.createUserReview();
                renderedReviewListComponent = noReviews;
            }

        }



        return (
            <div className="reviews" id='reviews'>
                <div className="reviews-header">
                    Reviews
                </div>
                {renderedUserReviewComponent}
                {renderedReviewListComponent}
            </div>
        );
    }
}

export default RestaurantReviews;