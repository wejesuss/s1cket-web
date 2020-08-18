import axios from 'axios';

const api = axios.create({
  baseURL: 'https://s1cket.herokuapp.com',
});

export default api;
