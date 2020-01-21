/* ========= SEARCH CONTROLLER  ==========
    Arquivo necessário por procurar devs no banco de dados
*/


const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringsAsArray');


module.exports = {
    async index(request, response) {
        //Buscar todos devs num raio 10km
        // Filtrar por tecnologias
        const { latitude, longitude , techs } = request.query;

        const techsArray = parseStringAsArray(techs);

        const devs = await Dev.find({
            techs: {
                $in:techsArray,
            },
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000,
                }
            }
        })
        return response.json({devs});
    }
}