class LoginController {
  
    showLogin(req, res) {
      res.render('auth/login');
    }
  }
  module.exports = new LoginController();