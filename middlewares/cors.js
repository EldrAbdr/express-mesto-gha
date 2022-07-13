const allowedCors = [
  'https://praktikum.tk',
  'http://praktikum.tk',
  'https://mesto.el.front.nomoredomains.xyz',
  'http://mesto.el.front.nomoredomains.xyz',
  'localhost:3000',
];

module.exports = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const requestHeaders = req.headers['access-control-request-headers'];

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  next();
};
