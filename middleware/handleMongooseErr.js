const handleMongooseErr = (req, res, next) => {
  error.status = 400;
  next();
};

export default handleMongooseErr;
