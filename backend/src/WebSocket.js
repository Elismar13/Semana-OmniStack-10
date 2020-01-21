const socketio = require('socket.io');

const parseStringAsArray = require('./utils/parseStringsAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];

exports.setupWebsocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        console.log(socket.id);                 //Mostra o ID da solicitação
        console.log(socket.handshake.query);   //Mostra os parâmetros recebidos
        
        /* == ENVIANDO UMA MENSAGEM ====
        setTimeout(() => {
            socket.emit('message', 'Hello OmniStack');
        }, 3000);
        */

        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    })
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        return calculateDistance(coordinates, connections.coordinates) < 10 
        && connection.techs.some(item => techs.includes(item));
    });
}

exports.sendMessage = (to, message, data => {
    to.ForEach(coonection => {
        io.to(connection.id).emit(message, data);
    });
})