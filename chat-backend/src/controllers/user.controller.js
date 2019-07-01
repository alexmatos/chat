const UserRepository = require('../models/user.repository')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

class UserController {
    async create(req, res, next) {
        try {
            let user = await UserRepository.save({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            })
            return res.json({
                status: 'sucess',
                message: 'Usuário criado com sucesso!',
                data: {
                    name: user.name,
                    email: user.email
                }
            })
        } catch (error) {
            next(error)
        }
    }

    async authenticate(req, res, next) {
        try {
            let user = await UserRepository.findByEmail(req.body.email)
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'E-mail não encontrado!',
                    data: null
                })
            }
            let passwordIsValid = await bcrypt.compare(req.body.password, user.password)
            if (!passwordIsValid) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Senha não confere!',
                    data: null
                })
            }
            const token = jwt.sign({
                    id: user._id
                },
                process.env.SECRET, {
                    expiresIn: '1d'
                }
            )
            return res.status(200).json({
                status: 'success',
                message: 'Usuário autenticado!',
                data: {
                    user: {
                        name: user.name,
                        email: user.email
                    },
                    token: token
                }
            })
        } catch (error) {
            next(err)
        }
    }
}

module.exports = new UserController()