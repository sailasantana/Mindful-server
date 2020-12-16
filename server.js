
const app = require('./app')
const knex = require('knex');
const {PORT, DATABASE_URL} = require('./misc/config');

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);



app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})