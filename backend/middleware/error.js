module.exports = function(error, req, res, next) {
  // Log the exeption (could be several lines long - separate module)
  console.log(error.message);
  // Send to client
  return res.status(500).json({ message: 'Something failed' });
};
