import React from 'react';
import { Link } from "react-router-dom";

import UserNav from './user_nav';
import UpcomingResItem from './upcoming_res_item';
import PastResItem from './past_res_item';

class UserReservations extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.currentUser) {
      this.props.getUserReservations(this.props.currentUser.id);
      this.props.getUserReviews(this.props.currentUser.id);
    }
  }

  sortUpcomingReservations() {
    let upcoming = this.props.reservations.upcoming;

    return upcoming.sort((a, b) =>
      a.date > b.date ? 1 : a.date === b.date ? (a.time > b.time ? 1 : -1) : -1
    );
  }

  displayUpcomingReservations() {
    let upcomingRes;

    if (this.props.reservations.upcoming.length > 0) {
      let sortedRes = this.sortUpcomingReservations();

      upcomingRes = (
        <>
          {sortedRes.map(reservation => (
            <UpcomingResItem
              currentUser={this.props.currentUser}
              reservation={reservation}
              openModal={this.props.openModal}
              key={reservation.id}
            />
          ))}
        </>
      );
    } else {
      upcomingRes = (
        <div className="user-page-nores-container-upcoming">
          <p>
            No Upcoming Reservations.&nbsp;
            <span>
              <Link to={`/`}>Book a Table.</Link>
            </span>
          </p>
        </div>
      );
    }

    return upcomingRes;
  }

  sortPastReservations() {
    let past = this.props.reservations.past;

    return past.sort((a, b) =>
      a.date < b.date ? 
        1 : a.date === b.date ? 
          (a.time < b.time ? 1 : 
              a.time === b.time ? 
              (a.restaurant < b.restaurant ? 1 : -1 ) : -1) : -1
    );
  }

  displayPastReservations() {
    let pastRes;
    let userFavoritesArray = this.props.currentUser.favorites;

    if (this.props.reservations.past.length > 0) {
      let sortedRes = this.sortPastReservations();

      pastRes = (
        <>
          {sortedRes.map(reservation => {
            let favoriteItem = userFavoritesArray.find( ({ restaurant_id }) => restaurant_id === reservation.restaurant_id );

            return <PastResItem
                      currentUser={this.props.currentUser}
                      createNewFavorite={this.props.createNewFavorite} 
                      deleteFavorite={this.props.deleteFavorite}
                      favorite={favoriteItem}
                      reservation={reservation} 
                      key={reservation.id} 
                      review={this.props.reviews[reservation.restaurant_id]}/>
          })}
        </>
      );
    } else {
      pastRes = (
        <div className="user-page-nores-container">
          <p>No Past Reservations.</p>
        </div>
      );
    }

    return pastRes;
  }

  sortCancelledReservations() {
    let cancelled = this.props.reservations.cancelled;

    return cancelled.sort((a, b) =>
      a.date < b.date ? 1 : a.date === b.date ? (a.time < b.time ? 1 : a.time === b.time ? (a.restaurant < b.restaurant ? 1 : -1 ) : -1 ) : -1
    );
  }

  displayCancelledReservations() {
    let cancelledRes;
    let userFavoritesArray = this.props.currentUser.favorites;

    if (this.props.reservations.cancelled.length > 0) {
      let sortedRes = this.sortCancelledReservations();

      cancelledRes = (
        <>
          {sortedRes.map(reservation => {
            let favoriteItem = userFavoritesArray.find( ({ restaurant_id }) => restaurant_id === reservation.restaurant_id );
            return <PastResItem 
                      currentUser={this.props.currentUser}
                      createNewFavorite={this.props.createNewFavorite}
                      deleteFavorite={this.props.deleteFavorite}
                      favorite={favoriteItem}
                      reservation={reservation} 
                      key={reservation.id}/>
          })}
        </>
      );
    } else {
      cancelledRes = (
        <div className="user-page-nores-container">
          <p>
            No Cancelled Reservations. 
          </p>
        </div>
      );
    }

    return cancelledRes;
  }

  render() {
    let renderedComponent = null;

    if (this.props.reservations) {
      renderedComponent = (
        <div className="user-page-reservations">
          <div className="user-page-content-block upcoming-res">
            <div className="user-page-content-block-header">
              <h2>Upcoming Reservations</h2>
            </div>
            {this.displayUpcomingReservations()}
          </div>
          <div className="user-page-content-block past-res">
            <div className="user-page-content-block-header">
              <h2>Past Reservations</h2>
            </div>
            {this.displayPastReservations()}
          </div>
          <div className="user-page-content-block cancelled-res">
            <div className="user-page-content-block-header">
              <h2>Cancelled Reservations</h2>
            </div>
            {this.displayCancelledReservations()}
          </div>
        </div>
      );
    }

    return (
      <div className="user-page wrapper">
        <div className="user-page-main-nav">
          <UserNav />
          <div className="user-page-main-content clearfix">
            {renderedComponent}
          </div>
        </div>
      </div>
    );
  }
}

export default UserReservations;