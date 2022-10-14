import axios from 'axios';

export const instance = axios.create({
    baseURL: 'https://fullstack.exercise.applifting.cz',
    headers: {'X-API-KEY': process.env.REACT_APP_API_KEY}
})

// {
//     "username": "Elizaveta Dolgova",
//     "password": "Hello_w@rld"
// }