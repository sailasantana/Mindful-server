const app = require('../app');

describe('App', () => {
    it('GET /api responds with 200 and "Welcome to Mind Your Moment Api"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Welcome to Mind Your Moment Api')
    })
})