import { connect } from 'react-redux';
import { 
    requestAllRestaurants,
    searchRestaurants
} from '../../actions/restaurant_actions';
import { openModal } from '../../actions/modal_actions';
import { clearReservationErrors } from '../../actions/reservation_actions';

import RestaurantIndex from './restaurant_index';

const mSTP = ({ session, entities: { users, restaurants }, search}) => ({
    currentUser: users[session.id],
    restaurants: Object.values(restaurants),
    date: search.date,
    time: search.time,
    seats: search.seats,
})

const mDTP = dispatch => ({
    requestAllRestaurants: () => dispatch(requestAllRestaurants()),
    searchRestaurants: (keyword) => dispatch(searchRestaurants(keyword)),
    openModal: modal => dispatch(openModal(modal)),
    clearReservationErrors: () => dispatch(clearReservationErrors()),
})


export default connect(mSTP, mDTP)(RestaurantIndex);