import * as ReviewAPIUtil from '../util/review_api_util';

export const RECEIVE_RESTAURANT_REVIEWS = 'RECEIVE_RESTAURANT_REVIEWS';
export const RECEIVE_REVIEW = 'RECEIVE_REVIEW';

export const RECEIVE_REV_ERRORS = 'RECEIVE_RES_ERRORS';
export const CLEAR_REV_ERRORS = 'CLEAR_REV_ERRORS';


const receiveRestaurantReviews = reviews => ({
    type: RECEIVE_RESTAURANT_REVIEWS,
    reviews
});

const receiveAReview = review => ({
    type: RECEIVE_REVIEW,
    review
});

export const receiveReviewErrors = errors => ({
    type: RECEIVE_REV_ERRORS,
    errors
});

export const clearReviewErrors = () => ({
    type: CLEAR_REV_ERRORS
});


export const getRestaurantReviews = restaurantId => dispatch => (
    ReviewAPIUtil.fetchRestaurantReviews(restaurantId)
        .then(reviews => dispatch(receiveRestaurantReviews(reviews)))
);

export const createReview = review => dispatch => (
    ReviewAPIUtil.createReview(review)
        .then(review => dispatch(receiveAReview(review)))
        .fail(errors => dispatch(receiveReviewErrors(errors.responseJSON)))
);

export const updateReview = review => dispatch => (
    ReviewAPIUtil.updateReview(review)
        .then(review => dispatch(receiveAReview(review)))
        .fail(errors => dispatch(receiveReviewErrors(errors.responseJSON)))
);

export const deleteReview = id => dispatch => (
    ReviewAPIUtil.deleteReview(id)
        .then(review => dispatch(receiveAReview(review)))
        .fail(errors => dispatch(receiveReviewErrors(errors.responseJSON)))
);
