// model
const User = require('../models/User');
const bcrypt = require("bcrypt");

let debug = console.log.bind(console);

class AuthController {

    login = async (req, res) => {
        if (req.method === 'GET')
            return res.render('auths/login')
        
        if (req.method === 'POST'){
            // $2b$10$3RmQL/V0HFr7hBFjTjJr1.dNmv1sGAbj7cjg2MBdioWGoVMUvVqwK
            const body = req.body;
            const user = await User.findOne({ email: body.email });
            if (user) {
                // check user password with hashed password stored in the database
                const validPassword = await bcrypt.compare(body.password, user.password, (err, data) => {
                    if(!data){
                        res.status(400).json({ error: "Invalid Password" });
                    } else {
                        req.session.user = user

                        if (user.status == 0) {
                            return res.redirect('/admin/')
                        }
                        if (user.status == 1) {
                            return res.redirect('/')
                        }
                        if (user.status == 2) {
                            return res.redirect('/providers')
                        }
                        if (user.status == 3) {
                            return res.redirect('/')
                        }
                        return  res.status(200).json({ message: "Valid password" });
                    }
                });
            } else {
                res.status(401).json({ error: "User does not exist" });
            }
        }

        return  res.status(404)
    }

    signup = async (req, res) => {
        if (req.method === 'GET')
            return res.render('auths/signup')
        
        if (req.method === 'POST') {
            const body = req.body;

            if (!(body.email && body.password)) {
                return res.status(400).send({ error: "Data not formatted properly" });
            }

            // createing a new mongoose doc from user data
            body.status = 3
            const user = new User(body);
            // generate salt to hash password
            const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            user.password = await bcrypt.hash(user.password, salt);
            user.save().then((doc) =>  
                res.redirect('/')
            /*res.status(201).send(doc)*/);
        }
    }

}

module.exports = new AuthController;