const Channel = require('./channel.schema')
const UserRepository = require('./user.repository')

class ChannelRepository {
    async find(key) {
        try {
            let query = {}
            if (key) query.name = new RegExp(key, 'i')
            return await Channel.find(query).populate({
                path: 'admin'
            }).sort('name').limit(20).exec()
        } catch (error) {
            throw new Error("Erro ao buscar canal. " + error.message)
        }
    }

    async findByName(name) {
        try {
            let query = {
                name: name
            }
            return await Channel.findOne(query, {
                history: {
                    $slice: 0
                }
            }).populate({
                path: 'admin'
            }).exec()
        } catch (error) {
            throw new Error("Erro ao buscar canal pelo nome. " + error.message)
        }
    }

    async findHistoryByName(name, page) {
        try {
            let query = {
                name: name
            }
            let inicio = 20 * page
            let fim = 20
            let channels = await Channel.findOne(query, {
                history: {
                    $slice: [inicio, fim]
                }
            }).populate({
                path: 'history.user'
            }).exec()
            return channels.history
        } catch (error) {
            throw new Error("Erro ao buscar histórico do canal pelo nome. " + error.message)
        }
    }


    async findById(id) {
        try {
            return await Channel.findById(id).exec()
        } catch (error) {
            throw new Error("Erro ao buscar canal por id. " + error.message)
        }
    }

    async save(data) {
        try {
            if (!data._id) {
                retur await Channel.create(data)
            } else {
                return await Channel.findByIdAndUpdate(data._id, data)
            }
        } catch (error) {
            throw new Error("Erro ao salvar canal. " + error.message)
        }
    }

    async delete(channelName, userId) {
        try {
            let channel = await this.findByName(channelName)
            if (channel.admin.toString() != userId) {
                throw new Error("Apenas o administrador pode excluir o canal.")
            }
            return await channel.remove()
        } catch (error) {
            throw new Error("Erro ao excluir canal. " + error.message)
        }
    }

    async addMessage(channelName, senderId, message) {
        try {
            let sender = await UserRepository.findById(senderId)
            let channel = await Channel.findOne({name: channelName})
            let message = {
                user: sender,
                message: message,
                dateTime: new Date()
            }
            channel.history.unshift(newMessage)
            await channel.save()
            return newMessage
        } catch (error) {
            throw new Error("Erro ao enviar mensagem para o canal. " + error.message)
        }
    }
}

module.exports = new ChannelRepository()
