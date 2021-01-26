const jwt = require('jsonwebtoken');

function validateToken(req,res,next) {

    const { session_token } = req.headers;

    jwt.verify(session_token, 'secret', (err, tokenDecoded) => {
        if(err) {
            res.statusMessage = "Not Authorized"
            res.status(401).end()
        }
        else {
             const user = {
                 tokenDecoded : tokenDecoded
             }
             req.user = user

             next();

        }
    })

}

module.exports = validateToken;
