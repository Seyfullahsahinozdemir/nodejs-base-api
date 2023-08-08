module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || "debug",
  DB_NAME: process.env.DB_NAME,
  DB_USERNAME: process.env.LOG_LEVEL,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_DIALECT: process.env.DB_DIALECT,
  PORT: process.env.PORT || "3000",
  JWT: {
    SECRET: "123456",
    EXPIRE_TIME: !isNaN(parseInt(process.env.TOKEN_EXPIRE_TIME))
      ? parseInt(process.env.TOKEN_EXPIRE_TIME)
      : 24 * 60 * 60,
  },
};
