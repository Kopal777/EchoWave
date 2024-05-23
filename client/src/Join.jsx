import React, { useState } from 'react';
import io from 'socket.io-client';
import Chat from './Chat';
import './join.css';
import picture from './assets/communication.png';
import picture2 from './assets/imageicon.png';
import { Link } from 'react-router-dom';

const socket = io.connect("http://localhost:3001")

function Join() {

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [showChat, setShowChat] = useState(false);

    const joinRoom = () => {
        if (username !== "" && room !== "") {
            socket.emit("join_room", room);
            // setShowChat(true);
        }
    }

    return (
        <div className='bg-[#cdabef] h-screen'>
                <div>
                    <div className='flex items-center font-bold text-3xl bg-[#dbc0f4] p-1.5'>
                        <img className='w-14 h-14 mx-2' src={picture} alt="" />
                        <h3>Echo</h3>
                        <h3 className='text-white'>Wave</h3>
                    </div>

                    <div className='grid grid-cols-2 lg:grid-cols-2'>

                        <div className=''>
                            <div>
                                <h1 class='heading1'>EchoWave
                                    <h2 class='heading2'>Where Conversations Flow</h2>
                                </h1>
                            </div>

                            <div class="cont">
                                <form onSubmit={joinRoom} action="submit" class="form_main">
                                    <p class="heading">Chat Room</p>
                                    <div class="inputContainer">
                                        <input type="text" class="inputField" id="username" onChange={(e) => { setUsername(e.target.value) }} placeholder="Username" />
                                    </div>
                                    <div class="inputContainer">
                                        <input type="text" class="inputField" id="password" onChange={(e) => { setRoom(e.target.value) }} placeholder="Room ID" />
                                    </div>
                                    <Link onClick={joinRoom} to={`/Chat/${socket}/${username}/${room}`}>
                                        <button id="button">Join</button>
                                    </Link>
                                </form>
                            </div>

                        </div>


                        <div className='top-[15%] right-[20%] relative hidden sm:block md:block lg:block'>
                            <img src={picture2} alt="" />
                        </div>

                    </div>

                </div>

            
        </div>
    )
}

export default Join
