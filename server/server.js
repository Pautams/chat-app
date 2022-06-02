const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const { Server } = require('socket.io') //importing socket.io library
const mysql = require('mysql')

const connection = mysql.createConnection({
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'chat-app'
});

app.use(cors());

const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', (socket) => {
    console.log('Welcome to Ron-Paul ChatRoom', socket.id)

    socket.on('set_room', (data,name) => {
        socket.join(data)
        console.log(`Name: ${name} Chat Room: ${data}`)
        connection.query("INSERT INTO room (name, room) VALUES ('" + name + "', '" + data + "')")

    })

    socket.on('send_message', (data) => {
        socket.to(data.room).emit('receive_message', data)
        connection.query("INSERT INTO messages (sender, message, room) VALUES ('" + data.author + "', '" + data.message + "', '" + data.room + "')")
    })

    socket.on('disconnect', () => {
        console.log('Disconnected', socket.id)
    })
})
//io works on listening events
server.listen(3001, () => { 
    console.log('Server Connected')
})