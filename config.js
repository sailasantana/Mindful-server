module.exports = {
  PORT: process.env.PORT || 8050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://saila@localhost/mindful',
  TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://saila@localhost/mindful-test'
}