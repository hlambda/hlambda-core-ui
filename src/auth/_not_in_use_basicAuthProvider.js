const basicAuthProvider = {
  isAuthenticated: false,
  signin(callback) {
    basicAuthProvider.isAuthenticated = true;
    setTimeout(callback, 100); // fake async
  },
  signout(callback) {
    basicAuthProvider.isAuthenticated = false;
    setTimeout(callback, 100);
  },
};

export { basicAuthProvider };
