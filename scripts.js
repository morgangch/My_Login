const crypto = require('crypto');

document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.LOGIN');
    const signupButton = document.querySelector('.SIGNUP');
    const logoutButton = document.querySelector('.LOGOUT');
    const password = document.querySelector('.PASSWORD');
    const username = document.querySelector('.USERNAME');
    const on_login = document.querySelector('.Login_Submit');
    const on_signup = document.querySelector('.Signup_Submit');
  
    loginButton.addEventListener('click', function () {
      window.location.href = '/login';
    });
  
    signupButton.addEventListener('click', function () {
      window.location.href = '/signup';
    });

    logoutButton.addEventListener('click', function () {
      window.location.href = '/';
    });

    on_login.addEventListener('click', function () {
      const passwordValue = password.value;
      const hashedValue = crypto.createHash("sha256").update(passwordValue).digest("hex");
      console.log(hashedValue);
    });
});