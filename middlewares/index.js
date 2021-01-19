module.exports = (req, res, next) => {
  if (req.headers['x-application-id'] !== 'pradma12345') {
    res.json({ error: 'Header value incorrect' });
  } else {
    next();
  }
  console.log(req.headers['x-application-id']);
};
