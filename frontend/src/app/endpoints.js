const endpoints = {
  users: {
    login: process.env.REACT_APP_API_URL + "/users/login",
    register: process.env.REACT_APP_API_URL + "/users/register",
  },
};

export default endpoints;

