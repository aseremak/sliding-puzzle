import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://slide-puzzle-as.firebaseio.com/'
})

export default instance;