import React, { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';

const socket = io.connect("http://localhost:3001")

function App() {

  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  }

  return (
    <div className='text-center mt-10'>
      {!showChat ? (
        <div>
          <h3 className='text-3xl mb-5 font-semibold'>Join chat</h3>
          <div className='flex flex-col'>
            <div>
              <input className='border-2 my-2 p-2 w-2/5' type="text" placeholder='Username' onChange={(e) => { setUsername(e.target.value) }} />
            </div>
            <div>
              <input className='border-2 my-2 p-2 w-2/5' type="text" placeholder='Room ID' onChange={(e) => { setRoom(e.target.value) }} />
            </div>
            <div>
              <button className='border-2 my-2 bg-green-400 p-2 w-2/5' onClick={joinRoom}>Join Room</button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <Chat socket={socket} username={username} room={room} />
        </div>
      )}
    </div>
  )
}

export default App
