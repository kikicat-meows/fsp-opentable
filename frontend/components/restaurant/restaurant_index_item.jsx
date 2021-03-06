import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { formatOpeningTime } from '../../util/format_time_util';
import { formatNumReviews } from '../../util/format_rating_reviews_util';
import { displayRatingStars } from '../../util/display_avg_rating_stars_util';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar} from "@fortawesome/free-solid-svg-icons";

class RestaurantIndexItem extends React.Component {
    constructor(props) {
        super(props);

        this.makeReservation = this.makeReservation.bind(this);
    }

    timeslotButtons() {
        let availableTimeslots;

        if (this.props.restaurant.available_timeslots) {
            availableTimeslots = this.props.restaurant.available_timeslots;

            let displayButtons = [];
            
            for (let i = 0; i < availableTimeslots.length; i++) {
                let timeslot = availableTimeslots[i];

                if (timeslot.id !== "none") {
                    displayButtons.push(
                      <button
                        // type='submit'
                        className="restaurant-index-item-times-button"
                        value={timeslot.time}
                        key={timeslot.id}
                        onClick={this.makeReservation(timeslot.id)}>
                        {formatOpeningTime(timeslot.time)}
                      </button>
                    )
                } else {
                    displayButtons.push(
                      <button
                        className="restaurant-index-item-times-disabled"
                        key={`disabled${i}`}
                        disabled>
                        #:## ##
                      </button>
                    );
                }
            }
            return displayButtons;
        }
    };


    makeReservation(timeslotId) {
        return e => {
            e.preventDefault();
            if (!this.props.currentUser) {
                this.props.openModal('login');
                return;
            }

            this.props.history.push({
                pathname: '/reservations/new',
                search: `restaurantId=${this.props.restaurant.id}&seats=${this.props.seats}&date=${this.props.date}&timeslotId=${timeslotId}&time=${e.target.value}`
            });
        }
    };

    render () {
        let restaurant = this.props.restaurant;

        const cuisines = restaurant.cuisine;
        const link = `/restaurants/${restaurant.id}`;

        let indexItem;

            if (this.props.restaurant) {
                indexItem = (
                  <div className="restaurant-index-item">
                    <Link className="restaurant-index-img-link" to={link}>
                      <img
                        src={window.trashcanURL}
                        alt="placeholder-restaurant-image"
                        className="restaurant-index-item-img"
                      />
                    </Link>
                    <div className="restaurant-index-item-content">
                      <div className="restaurant-index-header">
                        <Link
                          className="restaurant-index-item-link"
                          to={link}
                          target="_blank"
                        >
                          {restaurant.name}
                        </Link>
                      </div>
                      <div className="restaurant-index-item-rating">
                        <div className="restaurant-index-item-rating-container">
                          {displayRatingStars(restaurant.avg_rating)}
                        </div>
                        <Link 
                            to={`/restaurants/${restaurant.id}#reviews`}
                            target='_blank'
                            className="restaurant-index-item-review-count">
                          ({formatNumReviews(restaurant.num_reviews)})
                        </Link>
                      </div>
                      <div className="restaurant-index-item-info">
                        <span>{cuisines[0]}</span>
                        <span className="span-dot">&#183;</span>
                        <span>{restaurant.city}</span>
                      </div>
                      <div className="restaurant-index-item-times">
                        {this.timeslotButtons()}
                      </div>
                    </div>
                  </div>
                );
            } 

        return (
            <>
                {indexItem}
            </>

        )
    }
}


export default withRouter(RestaurantIndexItem);