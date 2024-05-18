import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaRegSmile } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import { HiMiniUserGroup } from "react-icons/hi2";
import Picker from '@emoji-mart/react'
import useOutsideClick from './hooks/useOutsideClick';

function Chat({ socket, username, room }) {

    const { showEmoji, setShowEmoji, ref } = useOutsideClick(false);
    const [file, setFile] = useState();
    const [users, setUsers] = useState([]);
    const inputRef = useRef(null);

    const handleEmojiShow = (e) => {
        e.preventDefault();
        setShowEmoji((v) => !v);
    }
    const handleEmojiSelect = (e) => {
        setMsg((newMessage) => (newMessage += e.native));
    }
    const handleKeyDown = (e) => {
        e.preventDefault();
        if (e.key === "Enter") {
            setShowEmoji(false);
            inputRef.current.focus();
        }
    }

    const [msg, setMsg] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if (msg !== "") {
            if (file) {
                const messageData = {
                    username: username,
                    type: "file",
                    body: file,
                    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                    mimeType: file.type,
                    fileName: file.name
                }
                setMsg("");
                setFile();
                await socket.emit("send_message", messageData);
            }
            else {
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
    }

    const selectFile = (e) => {
        if (typeof e.target.value[0] != "undefined") {
            setMsg(e.target.files[0].name);
            setFile(e.target.files[0]);
        }
        else {
            return null;
        }
    }

    useEffect(() => {
        socket.off("recieve-message").on("recieve_message", (data) => {
            setMessageList((list) => [...list, data]);
        })
    }, [])

    return (
        <div className='grid grid-cols-2 md:grid-cols-[0.70fr_2fr] h-screen'>
            <div className='bg-[#501b85]'>
                <div className='text-2xl flex items-center p-6 text-white font-semibold'>
                    <HiMiniUserGroup style={{ fontSize: "40px" }} />
                    Active Members
                </div>
            </div>
            <div className='bg-[#9e7ac2]'>
                <div className='bg-[#261833] mb-4'>
                    <h2 className='text-2xl flex p-6 rounded-md text-white font-semibold'>
                        Room {room}
                    </h2>
                </div>
                <ScrollToBottom className='h-[480px]'>
                    {messageList.map((messageContent) => {
                        if (username == messageContent.username) {
                            return <div className='m-1 mb-2 ml-[220px]'>
                                <div className='flex justify-end'>
                                    <div className='rounded-l-lg text-left rounded-tr-lg p-2 px-3 text-white bg-[#351b85]'>
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
                            return <div className='m-1 mb-2 mr-[220px]'>
                                <div className='border rounded-t-lg text-left rounded-br-lg p-1 px-2 w-fit bg-white '>
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
                {showEmoji && (
                    <div onKeyDown={handleKeyDown} ref={ref} className='fixed bottom-24'>
                        <Picker onEmojiSelect={handleEmojiSelect} emojiSize={30} />
                    </div>
                )}
                <div className='flex fixed bottom-0 bg-white items-center justify-between w-full'>
                    <div className='flex'>
                        <div>
                            <button onClick={handleEmojiShow}>
                                <FaRegSmile style={{ fontSize: "40px", padding: "5px" }} />
                            </button>
                        </div>
                        <label htmlFor="file-input">
                            <div>
                                <FiPaperclip style={{ fontSize: "36px", padding: "5px" }} />
                            </div>
                        </label>
                        <div className='flex-grow mx-2'>
                            <input
                                ref={inputRef}
                                value={msg}
                                onKeyDown={(event) => {
                                    event.key === "Enter" && sendMessage()
                                }}
                                className='p-2 outline-none'
                                type="text" placeholder='Type a message'
                                onChange={(e) => { setMsg(e.target.value) }} />
                        </div>
                    </div>

                    <div>
                        <button className='p-2' onClick={sendMessage}>
                            <IoSend style={{ fontSize: "30px" }} />
                        </button>
                    </div>
                </div>
            </div>
        </div>



        // <div className='mt-10 text-center flex flex-col items-center'>
        //     <div className='text-3xl w-2/4 p-1 rounded-md bg-slate-800 text-white font-semibold'>
        //         Live Chat
        //     </div>
        //     <div className='border-2 rounded-md w-2/4'>
        //         <div className='border-b-2 h-[500px] p-2'>
        //             <ScrollToBottom className='h-[500px]'>
        //                 {messageList.map((messageContent) => {
        //                     if (username == messageContent.username) {
        //                         return <div className='m-1 mb-4 ml-6'>
        //                             <div className='flex justify-end'>
        //                                 <div className='border rounded-l-lg rounded-tr-lg p-1 px-2  bg-green-600 '>
        //                                     {messageContent.message}
        //                                 </div>
        //                             </div>
        //                             <div className='flex gap-2 justify-end text-xs text-slate-500'>
        //                                 <div>
        //                                     {messageContent.time}
        //                                 </div>
        //                                 <div>
        //                                     You
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     }
        //                     else {
        //                         return <div className='m-1 mb-4 mr-6'>
        //                             <div className='border rounded-t-lg rounded-br-lg p-1 px-2 w-fit bg-blue-600 '>
        //                                 {messageContent.message}
        //                             </div>
        //                             <div className='flex gap-2 text-xs text-slate-500'>
        //                                 <div>
        //                                     {messageContent.time}
        //                                 </div>
        //                                 <div>
        //                                     {messageContent.username}
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     }

        //                 })}
        //             </ScrollToBottom>

        //         </div>

        //         {showEmoji && (
        //             <div onKeyDown={handleKeyDown} ref={ref} className='fixed bottom-24'>
        //                 <Picker onEmojiSelect={handleEmojiSelect} emojiSize={30} />
        //             </div>
        //         )}

        //         <div className='flex items-center justify-between w-full'>
        //             <div className='flex'>
        //                 <div>
        //                     <button onClick={handleEmojiShow}>
        //                         <FaRegSmile style={{ fontSize: "40px", padding: "5px" }} />
        //                     </button>
        //                 </div>
        //                 <label htmlFor="file-input">
        //                     <div>
        //                         <FiPaperclip style={{ fontSize: "36px", padding: "5px" }} />
        //                     </div>
        //                 </label>
        //                 <div className='flex-grow mx-2'>
        //                     <input
        //                         ref={inputRef}
        //                         value={msg}
        //                         onKeyDown={(event) => {
        //                             event.key === "Enter" && sendMessage()
        //                         }}
        //                         className='p-2 outline-none'
        //                         type="text" placeholder='Type a message'
        //                         onChange={(e) => { setMsg(e.target.value) }} />
        //                 </div>
        //             </div>

        //             <div>
        //                 <button className='p-2' onClick={sendMessage}>
        //                     <IoSend style={{ fontSize: "30px" }} />
        //                 </button>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    )
}

export default Chat
