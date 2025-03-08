const endpoints = {
  users: {
    login: process.env.REACT_APP_API_URL + "/users/login",
    register: process.env.REACT_APP_API_URL + "/users/register",
  },
  machines: {
    list: process.env.REACT_APP_API_URL + "/machines/list",
    register: process.env.REACT_APP_API_URL + "/machines/register",
  }
};

export default endpoints;

