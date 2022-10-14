const usersSchema = require('../models/users.model');
const crypto = require('crypto')

function hashPassword(password, salt) {
    // if needed for compare don't generate salt
    if (salt == null)
        salt = crypto
            .randomBytes(16)
            .toString('base64');
    // generate hash from password and salt
    let hash = salt + crypto
        .createHash('sha256')
        .update(salt + password)
        .digest('hex');

    return hash;
}

function comparePassHash(password, hash) {
    // take the salt from the hash 
    let salt = hash.split('==')[0];
    salt += '==';
    //create new hash of password with the salt
    let hashedPass = hashPassword(password, salt);

    return hashedPass == hash;
}

exports.post_signup = (req, res) => {
    let userBody = req.body;

    userBody.password = hashPassword(userBody.password);

    let user = new usersSchema(userBody);

    user.save()
        .then(() => res.status(201).json({ message: "User was added to the DataBase.", success: true }))
        .catch((err) => res.status(400).json({ message: err.toString(), success: false }));
}

exports.post_signin = (req, res) => {
    let { userName, password } = req.body;

    // select name,email,password,_id from Users
    // WHERE email == users.email 
    usersSchema
        .findOne({ userName: userName })
        .then((result) => {
            if (result != null) {

                let validPass = comparePassHash(password, result.password);
                if (validPass) {
                    result.password = "";
                    res.status(202).json({
                        message: "login success.",
                        success: true,
                        user: result,
                    });
                }
                else
                    res.status(402).json({
                        message: "wrong email or password",
                        success: false,
                    });
            } else {
                res.status(402).json({
                    message: "wrong email or password",
                    success: false,
                });
            }
        }).catch((err) => res.status(500).json({ message: "you no get in hahahaha", success: false }));
}