import express from 'express'
import bcrypt from 'bcrypt'
import User from '../models/User.model.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const user = express.Router()

user.get('/', async (req, res) => {
    try {
        const users = await User.find()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ msg: 'Erro na rota GET de USER', error })
    }
})

user.post('/create', async (req, res) => {
    const { nome, email, senha, idade, peso, objetivo, atividade, altura } = req.body

    if (!nome | !email | !senha | !idade | !peso | !objetivo | !atividade | !altura) {
        return res.status(400).json({ msg: 'Por favor insira os campos necessarios' })
    }

    try {

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ msg: 'Usuario ja cadastrado, por favor efetue o login' })
        }



        const senhaHash = await bcrypt.hash(senha, 12)

        const dados_user = {
            nome,
            email,
            senha: senhaHash,
            idade,
            peso,
            objetivo,
            atividade,
            altura
        }

        const newUser = await User.create(dados_user)

        await newUser.save()

        await criarTreino(newUser)


        res.status(200).json({ msg: 'Usuario criado com sucesso' })
    } catch (error) {
        res.status(500).json({ msg: 'Erro na rota de POST de USER', error })
    }
})

const criarTreino = async (user) => {

    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const mensagem = `O usuário se chama ${user.nome}, tem ${user.idade} anos e pesa ${user.peso} kg. 
        Ele realiza atividades físicas ${user.atividade} por semana.
        O objetivo dele é ${user.objetivo}.
        Com base nesses dados, crie um treino que seja adequado para o objetivo de ${user.objetivo}, levando em consideração o nível de atividade de ${user.atividade}.
        O treino deve incluir exercícios com o número de séries e repetições adequadas para uma pessoa que pratica atividades ${user.atividade} vezes por semana. 
        O treino deve ser detalhado, incluindo o nome do exercício, número de séries, repetições e o tempo de descanso entre os exercícios.
        Me retorne em forma de JSON , e sem acento nas propiedades
    `
        const response = await model.generateContent(mensagem)
        if (response && response.response.candidates) {
            const treinoGerado = response.response.candidates[0]?.content.parts[0]?.text

            // user.treino = treinoGerado

            // await user.save()

            return console.log(treinoGerado)
        }


    } catch (error) {
        console.log('erro', error)
    }
}

export default user