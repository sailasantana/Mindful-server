const knex = require('knex');
const bcrypt = require('bcrypt');
const app = require('../app');
const { createUsersArray } = require('./user-fixtures');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const { expect } = require('chai');


describe('User Endpoints', function() {

    let db;

    const testUsers = createUsersArray();
    const testUser = testUsers[0]

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy());

    afterEach('cleanup', () => db.raw('TRUNCATE TABLE user_posts RESTART IDENTITY;'));

    afterEach('cleanup', () => db('journal_users').delete());

    describe('POST /api/signup', () => {
        context('Sign up validation', () => {

            beforeEach('insert users', () => {
                helpers.seedUsers(db, testUsers)
            })

            const requiredFields = ['user_name', 'password', 'first_name', 'last_name'];
            
            requiredFields.forEach(field => {
                const registerAttempt = {
                    user_name : 'test_user_name',
                    password : 'test_password',
                    first_name : 'test',
                    last_name: 'test'
                }

                it(`Responds with 400 when required '${field}' is missing`, () => {
                    delete registerAttempt[field]

                    return supertest(app)
                        .post('/api/signup')
                        .send(registerAttempt)
                        .expect(400, {error: `Missing '${field}' in request body`})
                })

                it(`Responds with 400 when user_name is already taken`, () => {

                    const testUsers = createUsersArray()

                    before('insert users', () => {
                        helpers.seedUsers(db, testUsers)
                    })

                    const duplicateUser = {
                        first_name : 'test',
                        last_name: 'test',
                        user_name : testUser.user_name,
                        password  : '11aaA!'
                    }

                    return supertest(app)
                            .post('/api/signup')
                            .send(duplicateUser)
                            .expect(400, {error: `Username already taken.`})
                })
            })

        })
    })

})



