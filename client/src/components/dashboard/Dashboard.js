import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getCurrentProfile } from '../../actions/profile';

const Dashboard = props => {
  const { getCurrentProfile } = props;
  const { user, isAuthenticated } = props.auth;
  const { profile, loading } = props.profile;
  useEffect(() => {
    getCurrentProfile();
  }, []);

  if (loading && profile === null) {
    return <Spinner />;
  }
  return (
    <>
      {user && (
        <Fragment>
          <h1 className='large text-primary'>Dashboard</h1>
          <p className='lead'>
            <i className='fas fa-user' /> Welcome {user && user.name}
          </p>
          {profile !== null ? (
            <Fragment>has</Fragment>
          ) : (
            <Fragment>
              <p>You have not yet setup a profile, please add a profile.</p>
              <Link to='/create-profile' className='btn btn-primary my-1'>
                Create Profile
              </Link>
            </Fragment>
          )}
        </Fragment>
      )}
    </>
  );
};

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getCurrentProfile }
)(Dashboard);
