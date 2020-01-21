module.exports = function parseStringAsArray(arrayAsString) {
    console.log("MENSAGEM:", arrayAsString);
    return arrayAsString.split(',').map(tech => tech.trim());
};