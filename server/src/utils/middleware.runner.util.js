


const runMiddleware=(req, middleware)=> {
  return new Promise((resolve, reject) => {
    middleware(
      req,
      {}, // fake res (not used by protectRoute)
      (err) => {
        if (err) reject(err);
        else resolve(null);
      }
    );
  });
}

export default runMiddleware;