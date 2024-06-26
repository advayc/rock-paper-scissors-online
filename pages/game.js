import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Backend server port

function Game() {
    const [name, setName] = useState('');
    const [hasJoined, setHasJoined] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [result, setResult] = useState('');
    const [players, setPlayers] = useState({});
    const [choice, setChoice] = useState('');

    useEffect(() => {
        socket.on('startGame', (players) => {
            console.log('Game started with players:', players);
            setPlayers(players);
            setGameStarted(true);
        });

        socket.on('gameResult', (gameResult) => {
            console.log('Game result received:', gameResult);
            setResult(`${gameResult.result}: ${gameResult.player1} vs ${gameResult.player2}`);
        });

        return () => socket.disconnect();
    }, []);

    const joinGame = () => {
        if (name) {
            console.log('Joining game with name:', name);
            socket.emit('joinGame', name);
            setHasJoined(true);
        }
    };

    const makeChoice = (choice) => {
        console.log('Making choice:', choice);
        socket.emit('makeChoice', choice);
        setChoice(choice);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            {!hasJoined ? (
                <div className="p-6 bg-gray-800 rounded shadow-md">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-4 py-2 border border-gray-700 rounded bg-gray-700 text-white"
                    />
                    <button
                        onClick={joinGame}
                        className="px-4 py-2 mt-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                    >
                        Join Game
                    </button>
                </div>
            ) : !gameStarted ? (
                <div className="p-6 bg-gray-800 rounded shadow-md">Waiting for another player to join...</div>
            ) : (
                <div className="p-6 bg-gray-800 rounded shadow-md">
                    <div className="mb-4 text-lg">Game Started: {Object.values(players).join(' vs ')}</div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => makeChoice('rock')}
                            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        >
                            Rock
                        </button>
                        <button
                            onClick={() => makeChoice('paper')}
                            className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        >
                            Paper
                        </button>
                        <button
                            onClick={() => makeChoice('scissors')}
                            className="px-4 py-2 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        >
                            Scissors
                        </button>
                    </div>
                    <div className="mt-4">Your choice: {choice}</div>
                    <div className="mt-4 font-bold">{result}</div>
                </div>
            )}
        </div>
    );
}

export default Game;
