document.addEventListener('DOMContentLoaded', function () {
    const loginButton = document.querySelector('.LOGIN');
    const signupButton = document.querySelector('.SIGNUP');
  
    loginButton.addEventListener('click', function () {
      window.location.href = '/login';
    });
  
    signupButton.addEventListener('click', function () {
      window.location.href = '/signup';
    });
});