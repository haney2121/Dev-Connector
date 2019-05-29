import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteExp } from '../../actions/profile';

const DashboardExp = props => {
  const { deleteExp } = props;
  const { profile } = props.profile;
  const { loading } = props.auth;
  useEffect(() => {
    getCurrentProfile();
  }, [loading]);

  return (
    <div>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {profile.experience.map(exp => (
            <tr key={exp._id}>
              <td>{exp.company}</td>
              <td className='hide-sm'>{exp.title}</td>
              <td className='hide-sm'>
                <Moment format='MM-DD-YYYY'>{exp.from}</Moment> -{' '}
                {exp.current ? (
                  'Current'
                ) : (
                  <Moment format='MM-DD-YYYY'>{exp.to}</Moment>
                )}
              </td>
              <td>
                <button
                  className='btn btn-danger'
                  onClick={() => deleteExp(exp._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

DashboardExp.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  deleteExp: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteExp }
)(DashboardExp);
