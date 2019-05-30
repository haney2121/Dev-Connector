import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { getGithubRepos } from '../../actions/profile';

const ProfileGithub = props => {
  const { username, getGithubRepos, repos } = props;
  useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);
  return (
    <>
      <div className='profile-github'>
        <h2 className='text-primary my-1'>
          <i className='fab fa-github' /> Github Repos
        </h2>

        {repos === null ? (
          <Spinner />
        ) : (
          repos.map(repo => (
            <div className='repo bg-white p-1 my-1' key={repo.id}>
              <div>
                <h4>
                  <a
                    href={repo.svn_url}
                    target='_blank'
                    rel='noopener noreferrer'>
                    {repo.name}
                  </a>
                </h4>
                <p>{repo.description}</p>
              </div>
              <div>
                <ul>
                  <li className='badge badge-primary'>
                    Stars: {repo.stargazers_count}
                  </li>
                  <li className='badge badge-dark'>
                    Watchers: {repo.watchers}
                  </li>
                  <li className='badge badge-light'>Forks: {repo.forks}</li>
                </ul>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};

ProfileGithub.propTypes = {
  // repos: PropTypes.array.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  repos: state.profile.repos
});
export default connect(
  mapStateToProps,
  { getGithubRepos }
)(ProfileGithub);
