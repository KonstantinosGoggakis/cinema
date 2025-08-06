import axios from 'axios';
import { Platform } from 'react-native';

const localIp = Platform.select({
    ios: 'https://c57eb4014dca.ngrok-free.app',
    android: 'http://192.168.1.10:3000'
});

export const api = axios.create({
    baseURL: localIp
});
