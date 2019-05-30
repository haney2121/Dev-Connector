import React from 'react';
import Moment from 'react-moment';

const ProfileEdu = props => {
  const {
    school,
    from,
    to,
    current,
    degree,
    fieldofstudy,
    description
  } = props.edu;
  return (
    <>
      <h3>{school}</h3>
      <p>
        <Moment format='MMM YYYY'>{from}</Moment> -{' '}
        {current ? 'Current' : <Moment format='MMM YYYY'>{to}</Moment>}
      </p>
      <p>
        <strong>Degree: </strong>
        {degree}
      </p>
      <p>
        <strong>Field Of Study: </strong>
        {fieldofstudy}
      </p>
      {description && (
        <p>
          <strong>Description: </strong>
          {description}
        </p>
      )}
    </>
  );
};

export default ProfileEdu;
