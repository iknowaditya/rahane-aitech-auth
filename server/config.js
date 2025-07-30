module.exports = {
  mongoURI:
    process.env.MONGO_URI || "mongodb://localhost:27017/admin-dashboard",
  jwtSecret: process.env.JWT_SECRET || "your_jwt_secret_key",
  PORT: process.env.PORT || 4000,
};
