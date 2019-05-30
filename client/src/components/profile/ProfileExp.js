import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';

const ProfileExp = props => {
  const {
    company,
    from,
    current,
    to,
    description,
    title,
    location
  } = props.exp;
  return (
    <>
      <h3 className='text-dark'>{company}</h3>
      <p>{location}</p>
      <p>
        <Moment format='MMM YYYY'>{from}</Moment> -{' '}
        {current ? 'Current' : <Moment format='MMM YYYY'>{to}</Moment>}
      </p>
      <p>
        <strong>Position: </strong>
        {title}
      </p>
      <p>
        <strong>Description: </strong>
        {description}
      </p>
    </>
  );
};

ProfileExp.propTypes = {
  exp: PropTypes.object.isRequired
};

export default ProfileExp;
