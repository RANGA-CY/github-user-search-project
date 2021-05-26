import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [followers, setFollowers] = useState(mockFollowers);
  const [repos, setRepos] = useState(mockRepos);
  const [request, setRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ show: false, msg: '' });
  const checkRequests = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let { remaining } = data.rate;
        // remaining = 0;
        setRequest(remaining);
        if (remaining === 0) {
          // setError
          // setError({
          //   show: true,
          //   msg: 'sorry, You have used all your Requests',
          // });
          toggleError(true, 'sorry, you have exceeded your hourly rate limits');
        }
      })
      .catch((err) => console.log(err));
  };
  function toggleError(show = false, msg = '') {
    setError({ show, msg });
  }
  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);
    // console.log(user);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    // console.log(response);
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      // repos
      //  await axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) => {
      //     setRepos(response.data);
      //   });
      // await  axios(`${followers_url}?per_page=100`).then((response) => {
      //     setFollowers(response.data);
      //   });
      await Promise.allSettled([
        axios(`${rootUrl}/users/${login}/repos?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ])
        .then((result) => {
          const [repos, followers] = result;
          const status = 'fulfilled';
          if (repos.status === status) {
            setRepos(repos.value.data);
          }
          if (followers.status === status) {
            setFollowers(followers.value.data);
          }
        })
        .catch((err) => console.log(err));
      //https://api.github.com/users/john-smilga/repos?per_page=100
      // https://api.github.com/users/john-smilga/followers
    } else {
      toggleError(true, 'there is no user with that user name');
    }
    checkRequests();
    setIsLoading(false);
  };
  useEffect(() => {
    checkRequests();
  }, []);
  return (
    <GithubContext.Provider
      value={{
        githubUser,
        followers,
        repos,
        request,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
