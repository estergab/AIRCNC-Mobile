import axios from 'axios';

const api = axios.create({
    baseURL:'http://192.168.50.102:3335',
})

export default api;