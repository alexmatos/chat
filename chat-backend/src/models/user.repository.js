const User = require('./user.schema')

class UserRepository {
    async find(query) {
        try {
            return await User.find(query).sort('name')
                .limit(20).exec()
        } catch (error) {
            throw new Error("Erro ao buscar usuário. " + error.message)
        }
    }

    async findByName(name) {
        try {
            let query = {}
            if (name) {
                let key = new RegExp(name, i)
                query.name = key
            }
            return await User.find(query)
        } catch (error) {
            throw new Error("Erro ao buscar usuário por nome. " + error.message)
        }
    }

    async findByEmail(email) {
        try {
            return await User.findOne({
                email: email
            }).exec()
        } catch (error) {
            throw new Error("Erro ao buscar usuário por e-mail. " + error.message)
        }
    }

    async findById(id) {
        try {
            return await User.findById(id).exec()
        } catch (error) {
            throw new Error("Erro ao buscar usuário por id. " + error.message)
        }
    }

    async save(data) {
        try {
            if (!data._id) {
                return await User.create(data)
            } else {
                return await User.findByIdAndUpdate(data._id, data)
            }
        } catch (error) {
            throw new Error("Erro ao salvar usuário. " + error.message)
        }
    }

    async delete(id) {
        try {
            return await User.findByIdAndDelete(id)
        } catch (error) {
            throw new Error("Erro ao excluir usuário. " + error.message)
        }
    }
}

module.exports = new UserRepository()