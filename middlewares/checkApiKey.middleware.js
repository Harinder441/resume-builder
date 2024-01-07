const checkApiKey = (req, res, next) => {
    const apiKeyHeader = req.headers['x-api-key'];
  
    if (!apiKeyHeader || apiKeyHeader !== 'Abracadabra') {
      return res.status(403).json({ message: 'Unauthorised Access' });
    }
  
    next();
  };

module.exports = checkApiKey;