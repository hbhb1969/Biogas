exports.index = (req, res) => {
  let message = '';
  res.render('index', {
    message: message
  });
};