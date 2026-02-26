import axios from 'axios';
import { iDadosUsuario } from '../@types';

const api = axios.create({
  baseURL: 'https://pga.cigel.com.br:8095/',
  //baseURL: 'http://10.0.0.158:8091/',
  //baseURL: 'https://localhost:8095/',
  headers: {
    'Content-type': 'application/json',
  },
});

function getToken(): string | null {
  const usuario: iDadosUsuario = JSON.parse(
    localStorage.getItem('@Portal/usuario') || '{}'
  );
  const token = usuario.token || null;
  if (token) {
    console.log('Token:', token);
    return token;
  } else {
    console.error('Token não encontrado no localStorage');
    return null;
  }
}

api.interceptors.request.use((config) => {
  const token = getToken();
  config.headers = config.headers || {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
