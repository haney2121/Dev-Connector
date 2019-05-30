import React from 'react';
import { Link } from 'react-router-dom';

const DevelopersItem = props => {
  const { profile } = props;
  return (
    <>
      <div className='profile bg-light'>
        <img
          className='round-img'
          src={profile.user.avatar}
          alt={profile.user.name}
        />
        <div>
          <h2>{profile.user.name}</h2>
          <p>
            {profile.status} at {profile.company}
          </p>
          <p>{profile.location}</p>
          <Link
            to={`/developers/${profile.user._id}`}
            className='btn btn-primary'>
            View Profile
          </Link>
        </div>
        <ul>
          {profile.skills.map(skill => (
            <li className='text-primary' key={skill}>
              <i className='fas fa-check' /> {skill}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default DevelopersItem;
