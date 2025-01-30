import mongoose from "mongoose";

const connect = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log(`Conectou com o banco de dados: ${connection.connection.name}`)
    } catch (error) {
        console.log('Erro ao conectar com o bando de dados', error)
    }
}


export default connect