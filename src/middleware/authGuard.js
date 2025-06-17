function authGuard(roles = []) {
  return (req, res, next) => {
    if (!req.session.token) {
      return res.redirect('/login');
    }
    next();
  };
}

module.exports = authGuard;