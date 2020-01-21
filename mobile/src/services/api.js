import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.25.194:3333'   //IP do servidor + porta do node
});

export default api;