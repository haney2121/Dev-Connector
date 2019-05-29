import React, { useEffect } from 'react';
import Moment from 'react-moment';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentProfile, deleteEdu } from '../../actions/profile';

const DashboardEdu = props => {
  const { deleteEdu } = props;
  const { profile } = props.profile;
  const { loading } = props.auth;
  useEffect(() => {
    getCurrentProfile();
  }, [loading]);

  return (
    <div>
      <h2 className='my-2'>Education Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>School</th>
            <th className='hide-sm'>Degree</th>
            <th className='hide-sm'>Field</th>
            <th className='hide-sm'>Years</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {profile.education.map(edu => (
            <tr key={edu._id}>
              <td>{edu.school}</td>
              <td className='hide-sm'>{edu.degree}</td>
              <td className='hide-sm'>{edu.fieldofstudy}</td>
              <td className='hide-sm'>
                <Moment format='MM-DD-YYYY'>{edu.from}</Moment> -{' '}
                {edu.current ? (
                  'Current'
                ) : (
                  <Moment format='MM-DD-YYYY'>{edu.to}</Moment>
                )}
              </td>
              <td>
                <button
                  className='btn btn-danger'
                  onClick={() => deleteEdu(edu._id)}>
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

DashboardEdu.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  profile: state.profile,
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteEdu }
)(DashboardEdu);
