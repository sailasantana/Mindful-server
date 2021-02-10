const {expect} = require('chai');
const knex = require('knex');
const app = require('../app');
const { createUsersArray } = require('./user-fixtures');
const { createPostArray } = require('./posts-fixtures');
const helpers = require('./test-helpers');
const { before, beforeEach } = require('mocha');
const { createPostArray2 } = require('./posts-fixtures-2');

describe('User Posts Endpoints', () => {
    let db;

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL
        });
        app.set('db', db)
    });

    after('disconnect from db', () => db.destroy());

    before('clean the first table', () => db.raw('TRUNCATE TABLE user_posts RESTART IDENTITY;'));

    before('clean the second table', () => db('user_posts').delete());

    afterEach('cleanup first table', () => db.raw('TRUNCATE TABLE user_posts RESTART IDENTITY;'))

    //GET tests

    context ('Given there are posts saved in the db', () => {
        const testPosts = createPostArray();
        const testUsers = createUsersArray();
        const validUser = testUsers[0];
                
        beforeEach('insert test users', () => {
          return db
              .into('journal_users')
              .insert(testUsers)
  
        })
        
        beforeEach('insert user posts', () => {
            return db
            .into('user_posts')
            .insert(testPosts)
        });
  
        
        const expectedPosts = testPosts.filter(post => post.user_name == validUser.user_name);
        
        it ('GET api/:user_name/dashboard responds 200 and with all posts written by user', () => {
            return supertest(app)
            .get(`/api/${validUser.user_name}`)
            .set('session_token', helpers.makeSessionToken(validUser))
            .expect(200, expectedPosts)
        });
      })

      //POST tests

      describe (`POST api/:user_name`, () => {
        const testPosts2 = createPostArray2();
        const testUsers = createUsersArray();
        const testUser = testUsers[0]
  
        beforeEach('insert test users', () => {
            helpers.seedUsers(db, testUsers)
        })
  
        beforeEach('insert seed posts into db', () => {
            return db
            .into('user_posts')
            .insert(testPosts2)
        })
  
        const newPost = {     
            title: 'Test title',
            content: 'Test content',
            user_name: `${testUser.user_name}`
        };
  
        it ('Creates a new post , responds with 201', () => {
            return supertest(app)
                .post(`/api/${testUser.user_name}`)
                .set('session_token', helpers.makeSessionToken(testUser))
                .send(newPost)
                .expect(201)
                .expect(res => {
                    expect(res.body.title).to.eql(newPost.title)
                    expect(res.body.content).to.eql(newPost.content)
                    expect(res.body.user_name).to.eql(newPost.user_name)
                    expect(res.body).to.have.property('id')
                    expect(res.body).to.have.property('date_modified')
  
                })
             
        });  
  
        // const requiredFields = ['title', 'content', 'user_name'];
  
        // requiredFields.forEach(field => {
        //     const newSpot = {
        //       title: 'Test title',
        //       content: 'Test content',
        //       user_name: `${testUser.user_name}`
        //   };
  
            // it (`Responds with 400 and an error message when the ${field} is missing'`, () => {
            //     delete newSpot['field']
  
            //     return supertest(app)
            //         .post(`/api/${testUser}`)
            //         .set('session_token', helpers.makeSessionToken(testUser))
            //         .send(newSpot)
            //         .expect(400, {
            //             error: { message: `Missing '${field}' in request body.`}
            //         })
            // });
        });

        context('Given there are journal posts in the database', () => {
            const testPosts = createPostArray();
            const testUsers = createUsersArray();
            const testUser = testUsers[0]
                    
            beforeEach('insert test users', () => {
                helpers.seedUsers(db, testUsers)
            })
            
            beforeEach('insert journal entries', () => {
                return db
                .into('user_posts')
                .insert(testPosts)
            })
    
            it ('Responds with 204 and updates the journal entry', () => {
                const idToUpdate = 1;
    
                const updateEntry = {
                    content: 'test content updated'
                }
    
                const expectedEntry = {
                    ...testPosts[idToUpdate - 1],
                    ...updateEntry
                };
    
                return supertest(app)
                    .patch(`/api/${testUser.user_name}/${idToUpdate}`)
                    .set('session_token', helpers.makeSessionToken(testUser))
                    .send(updateEntry)
                    .set('session_token', helpers.makeSessionToken(testUser))
                    .expect(204)
                   
            });
    
        })
    
        //DELETE tests
    
        describe (`DELETE '/:user_name/:id'`, () => {
            
            context('Given there are posts in db', () => {
                const testPosts = createPostArray();
                const testUsers = createUsersArray();
                        
                beforeEach('insert test users', () => {
                    helpers.seedUsers(db, testUsers)
                })
                
                beforeEach('insert saved spots', () => {
                    return db
                    .into('user_posts')
                    .insert(testPosts)
                })
    
                it ('Responds with 204 and removes the post', () => {
                    const idToDelete = 1; 
                    const testUser = testUsers[0]
    
                    const expectedPosts = testPosts.filter(post => post.id !== idToDelete);
    
                    return supertest(app)
                        .delete(`/api/${testUser.user_name}/${idToDelete}`)
                        .set('session_token', helpers.makeSessionToken(testUser))
                        .expect(204)
                        .then(res => {
                            supertest(app)
                                .get(`/api/${testUser.user_name}`)
                                .expect(expectedPosts)
                        });
                });
            });
        });

    })

    //PATCH tests

 

  

// })