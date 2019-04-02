module.exports = function(req, res, next) {
  // 401 Unouthorized - for users to do some stuff
  // 403 Forbidden - even if the user is authorized he is forbidden
  // to do the specific stuff requiring admin priveliges
  if (!req.user.roles.isReader) return res.status(403).send('Access denied.');
  return next();
};
