const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config');
const bcrypt = require('bcrypt');


function makeSessionToken(user, secret = JWT_SECRET){
    
    const sessionObj = {
        user_name : user.user_name,
        first_name : user.first_name,
        last_name : user.last_name
    }

    const session_token = jwt.sign(
       sessionObj, secret, {expiresIn: '20m'} 
    )
    return session_token;
}

function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 1)
    }));

    return db.into('journal_users').insert(preppedUsers)
        
}

module.exports = {
    makeSessionToken,
    seedUsers
}