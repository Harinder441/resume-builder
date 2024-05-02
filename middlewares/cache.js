const NodeCache = require("node-cache");
const cache = new NodeCache();
const DEFAULT_TTL = 300;

const cacheMiddleware = (req, res, next) => {
  const key = req.originalUrl || req.url;
  
  const cachedData = cache.get(key);
  if (cachedData) {
    console.log("Cache hit!");
    return res.json(cachedData);
  }

  next();
};

const setCache = (key, data, ttl = DEFAULT_TTL) => {
  cache.set(key, data, ttl);
};

module.exports = { cacheMiddleware, setCache };
