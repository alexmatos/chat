const UserRepository = require('../models/user.repository')

class UserController {
    async create(req, res, next) {
        try {
            let user = await UserRepository.save({
                email: req.body.email,
                name: req.body.name,
                password: req.body.password
            })
            res.json({
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
}

module.exports = new UserController()