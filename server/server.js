const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 4000;

// Enable CORS for all origins
app.use(cors());

let players = {};
let choices = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinGame', (playerName) => {
        players[socket.id] = playerName;
        if (Object.keys(players).length === 2) {
            io.emit('startGame', players);
        }
    });

    socket.on('makeChoice', (choice) => {
        choices[socket.id] = choice;
        if (Object.keys(choices).length === 2) {
            const playerIds = Object.keys(choices);
            const result = determineWinner(choices[playerIds[0]], choices[playerIds[1]]);
            io.emit('gameResult', {
                player1: players[playerIds[0]],
                player2: players[playerIds[1]],
                result,
            });
            choices = {};
        }
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
        delete choices[socket.id];
        console.log('A user disconnected:', socket.id);
    });
});

const determineWinner = (choice1, choice2) => {
    if (choice1 === choice2) return 'Draw';
    if (
        (choice1 === 'rock' && choice2 === 'scissors') ||
        (choice1 === 'scissors' && choice2 === 'paper') ||
        (choice1 === 'paper' && choice2 === 'rock')
    ) {
        return 'Player 1 wins';
    }
    return 'Player 2 wins';
};

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
