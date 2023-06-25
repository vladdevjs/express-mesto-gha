module.exports = {
  port: process.env.PORT || 3000,
  mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mestodb',
  secretKey: process.env.SECRET_KEY || 'secret-key',
};
