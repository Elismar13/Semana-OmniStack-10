/* ========= DEV CONTROLLER  ==========
    Arquivo necessário por gerenciar os Devs cadastrados
    Basicamente as funções daqui são responsáveis por adicionar os devs, como adicionar, remover ou editar 
*/

const axios = require('axios');     //Biblioteca necessária para solicitações HTTP

const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringsAsArray');
const { findConnections, sendMessage } = require('../WebSocket');

module.exports = { 
    async index(request, response) {
        const devs = await Dev.find();

        return response.json(devs);
    },
    
    /* TAREFA:
        -Update: (atualizar o dev)
        -Delete: excluir um usuário
    */

    async store(request, response) {
        const { github_username, techs, latitude, longitude} = request.body;
    
        let dev = await Dev.findOne({ github_username });
        //console.log("Dev: ", dev);
        if(!dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
    
            let { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude]
            };
        
            dev = await Dev.create({
                github_username: github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location
            });

            //Filtrar conexões q estão há no máximo 10km de distância
            //e que o novo dev tenha pelo menos uma das tecnologias filtradas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
        }
        
        return response.json(dev);
    }
}