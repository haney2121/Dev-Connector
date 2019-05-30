import React from 'react';

const ProfileAbout = props => {
  const { bio, skills, user } = props.profile;
  let name = user.name.split(' ')[0];
  return (
    <>
      <div className='profile-about bg-light p-2'>
        <h2 className='text-primary'>{name}'s Bio</h2>
        {bio ? <p>{bio}</p> : `No Bio was added for ${name}`}

        <div className='line' />
        {skills && (
          <>
            <h2 className='text-primary'>Skill Set</h2>
            <div className='skills'>
              {skills.map((skill, i) => (
                <div className='p-1' key={i}>
                  <i className='fa fa-check' /> {skill}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ProfileAbout;
