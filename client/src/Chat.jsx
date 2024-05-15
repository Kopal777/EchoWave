import React, { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaRegSmile } from "react-icons/fa";
import Picker from '@emoji-mart/react'
import useOutsideClick from './hooks/useOutsideClick';

function Chat({ socket, username, room }) {

    const { showEmoji, setShowEmoji, ref } = useOutsideClick(false)

    const handleEmojiShow = (e) => {
        e.preventDefault();
        setShowEmoji((v) => !v);
    }
    const handleEmojiSelect = (e) => {
        setMsg((newMessage) => (newMessage += e.native));
    }

    const [msg, setMsg] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (msg !== "") {
            const messageData = {
                username: username,
                room: room,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                message: msg
            }
            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData]);
            setMsg("");
        }
    }

    useEffect(() => {
        socket.off("recieve-message").on("recieve_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [])

    return (
        <div className='mt-10 text-center flex flex-col items-center'>
            <div className='text-3xl w-2/4 p-1 rounded-md bg-slate-800 text-white font-semibold'>
                Live Chat
            </div>
            <div className='border-2 rounded-md w-2/4'>
                <div className='border-b-2 h-[500px] p-2'>
                    <ScrollToBottom className='h-[500px]'>
                        {messageList.map((messageContent) => {
                            if (username == messageContent.username) {
                                return <div className='m-1 mb-4 ml-6'>
                                    <div className='flex justify-end'>
                                        <div className='border rounded-l-lg rounded-tr-lg p-1 px-2  bg-green-600 '>
                                            {messageContent.message}
                                        </div>
                                    </div>
                                    <div className='flex gap-2 justify-end text-xs text-slate-500'>
                                        <div>
                                            {messageContent.time}
                                        </div>
                                        <div>
                                            You
                                        </div>
                                    </div>
                                </div>
                            }
                            else {
                                return <div className='m-1 mb-4 mr-6'>
                                    <div className='border rounded-t-lg rounded-br-lg p-1 px-2 w-fit bg-blue-600 '>
                                        {messageContent.message}
                                    </div>
                                    <div className='flex gap-2 text-xs text-slate-500'>
                                        <div>
                                            {messageContent.time}
                                        </div>
                                        <div>
                                            {messageContent.username}
                                        </div>
                                    </div>
                                </div>
                            }

                        })}
                    </ScrollToBottom>

                </div>

                {showEmoji && (
                    <div ref={ref} className='fixed bottom-24'>
                        <Picker onEmojiSelect={handleEmojiSelect} emojiSize={30} />
                    </div>
                )}

                <div className='flex'>
                    <div>
                        <button onClick={handleEmojiShow}>
                            <FaRegSmile style={{ fontSize: "40px", padding: "5px" }} />
                        </button>
                    </div>
                    <div>
                        <input value={msg} onKeyDown={(event) => {
                            event.key === "Enter" && sendMessage()
                        }} className='p-2 outline-none' type="text" placeholder='Type a message' onChange={(e) => { setMsg(e.target.value) }} />
                    </div>
                    <div>
                        <button className='p-2 ' onClick={sendMessage}><IoSend style={{ fontSize: "25px" }} /></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chat
