import { model, Schema } from 'mongoose'


const schemaUser = new Schema({
    nome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
    },
    senha: {
        type: String,
        required: true,
    },
    idade: {
        type: Number,
        required: true
    },
    peso: {
        type: Number,
        required: true
    },
    altura: {
        type: Number,
        required: true
    },
    atividade: {
        type: String,
        enum: ['0 vezes', '1-3 vezes', '4-6 vezes', '7 ou mais vezes'],
        required: true
    },
    objetivo: {
        type: String,
        enum: ['Emagrecer', 'Ganhar Massa', 'Manter Condição'],
        required: true,
    },
    treino: {
        type: [String],
        default: []
    },
    dataCadastro: {
        type: Date,
        default: Date.now,
    },
})


const User = model('User', schemaUser)


export default User

