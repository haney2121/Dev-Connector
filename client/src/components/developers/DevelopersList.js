import React, { useEffect } from 'react';
import DevelopersItem from './DevelopersItem';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getAllProfiles } from '../../actions/profile';

const DevelopersList = props => {
  const { getAllProfiles } = props;
  const { profiles, loading } = props.profile;
  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <>
      <h1 className='large text-primary'>Developers</h1>
      <p className='lead'>
        <i className='fab fa-connectdevelop' /> Browse and connect with
        developers
      </p>
      <div className='profiles'>
        {profiles.map(profile => (
          <DevelopersItem profile={profile} key={profile._id} />
        ))}
      </div>
    </>
  );
};

DevelopersList.propTypes = {
  getAllProfiles: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile
});

export default connect(
  mapStateToProps,
  { getAllProfiles }
)(DevelopersList);
