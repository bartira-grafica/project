const endpoints = {
  users: {
    login: process.env.REACT_APP_API_URL + "/users/login",
    register: process.env.REACT_APP_API_URL + "/users/register",
  },
  machines: {
    list: process.env.REACT_APP_API_URL + "/machines/list",
    register: process.env.REACT_APP_API_URL + "/machines/register",
    update: process.env.REACT_APP_API_URL + "/machines/update",
    delete: process.env.REACT_APP_API_URL + "/machines/delete/{}"
  }
};

export default endpoints;

