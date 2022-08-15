import { io } from 'socket.io-client'

export const socket_client = io('ws://localhost:3003');