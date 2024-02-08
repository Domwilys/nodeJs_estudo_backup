const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

const userController = {

    create: async (req, res) => {
        try {
            const { name, email, password, confirm_password } = req.body;
            const errors = [];

            //Verificação de erros
            if (!name || !email || !password || !confirm_password) {
                errors.push({text: 'All fields are required'});
            }

            if (typeof name == undefined || typeof email == undefined || typeof password == undefined || typeof confirm_password == undefined) {
                errors.push({text: 'Unable to send form data'});
            }

            if (name == null || email == null || password == null || confirm_password == null) {
                errors.push({text: 'All fields are required'});
            }

            if (password !== confirm_password) {
                errors.push({text: 'Passwords do not match'});
            }

            if (errors.length > 0) {
                return res.status(400).json({errors});
            } else {
                //Verificação se já existe um email ou um username cadastrado no banco de dados
                const existingEmail = await UserModel.findOne({ email });
                const existingName = await UserModel.findOne({ name });

                if (existingEmail) {
                    return res.status(400).json({msg: 'Email already registered'});
                }

                if (existingName) {
                    return res.status(400).json({msg: 'Username already registered'});
                }

                //Criação do usuário
                const hashedPassword = await bcrypt.hash(password, 10);

                const newUser = new UserModel({
                    name,
                    email,
                    password: hashedPassword
                });

                await newUser.save().then(() => {
                    res.redirect('/user');
                }).catch((error) => {
                    console.log(`Error registering user: ${error}`);
                });
            }

        } catch (error) {
            console.log(`Error registering user: ${error}`);
            res.status(500).json({msg: 'Internal server error'});
        }
    }

}

module.exports = userController;