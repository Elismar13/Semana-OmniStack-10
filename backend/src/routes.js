/* 
    4 métodos HTTO:
        -GET (pegar uma informação)
        -POST (criar alguma informação)
        -PUT (editar alguma coisa)
        -DELETE (excluir alguma coisa)

    Tipos de parâmetros:
        -Query Params:  request.query (Filtros, Ordenação, paginação, ...)
        -Route Params:  request.parms (Identificar um recurso na alteração ou remoção)
        -Body: request.body )Dados para criação ou alteração de um registro)
*/

const {Router} = require('express');
const DevControler = require('./controlers/DevControler');
const SearchControler = require('./controlers/SearchControler');

const routes = Router();

//Caminhos e suas respectivas funcões (requisição, resposta)
routes.get('/devs', DevControler.index);
routes.post('/devs', DevControler.store);

routes.get('/search', SearchControler.index);
module.exports = routes;