const express = require('express');   //FrameWork para o backend
const mongoose = require('mongoose'); //Biblioteca para o mongoDB
const cors = require('cors');
const http = require('http');
const routes = require('./routes');   //Nossa página de rotas
const { setupWebsocket } = require('./WebSocket');

const app = express();
const server = http.Server(app);      //Extraindo servidor http do express

setupWebsocket(server);

//Conexão com o banco de dados
mongoose.connect("mongodb+srv://knigth11:knigth11@cluster0-l6ync.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//Iniciando o App e as rotas
app.use(cors());
app.use(express.json());
app.use(routes);


server.listen(3333); //Porta em que o servidor está hospedado