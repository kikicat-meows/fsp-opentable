import { connect } from 'react-redux';

import { openModal } from '../../actions/modal_actions';
import { logout } from '../../actions/session_actions';

import Greeting from './greeting';


const mSTP = ({ session, entities: { users }}) => ({
    currentUser: users[session.id]
});

const mDTP = dispatch => ({
    logout: () => dispatch(logout()),
    openModal: modal => dispatch(openModal(modal)),
});

export default connect(mSTP, mDTP)(Greeting);