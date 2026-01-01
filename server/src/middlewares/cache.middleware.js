 const noCacheMiddleware = (req, res, next) => {
  console.log('🚫 Disabling cache...');
  res.set({
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
};

export default noCacheMiddleware;