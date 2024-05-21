import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaRegSmile } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import disconnect from './assets/logout.png';
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

    const disconnectUser = () => {
        socket.emit("disconnect");
    }

    const handleCopy = () => {
        console.log(room);
        navigator.clipboard.writeText(room);
        alert("Copied the text: " + room);
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-[0.65fr_2fr] h-screen'>
            <div className='bg-gradient-to-b from-[#220d38] via-[#7f2287] to-[#551855]'>
                <div className='text-2xl flex items-center p-6 text-white font-semibold'>
                    <HiMiniUserGroup style={{ fontSize: "40px", marginRight: "8px" }} />
                    Active Members
                </div>
            </div>

            <div className='bg-white'>

                <div className='bg-[#9d79bf] mb-4 flex justify-between'>
                    <h2 className='text-2xl flex p-4 rounded-md text-white font-bold'>
                        Room 
                        <h2 className='px-2 text-[#6e1846]'>{room}</h2>
                    </h2>
                    <div className='flex items-center'>
                        <button onClick={handleCopy} className='text-white bg-[#361657] rounded-full cursor-pointer hover:bg-[#0d5b36]'>
                            <IoCopyOutline style={{ width: "46px", height: "46px", padding: "10px" }} />
                        </button>
                        <button onClick={disconnectUser}>
                            <img className='w-12 h-12 mr-5 ml-3 bg-[#361657] hover:bg-[#b00808] p-2 rounded-full cursor-pointer' src={disconnect} alt="" />
                        </button>
                    </div>
                </div>

                <ScrollToBottom className='h-[480px]'>
                    {messageList.map((messageContent) => {
                        if (username == messageContent.username) {
                            return <div className='m-1 mb-2 ml-[220px]'>
                                <div className='flex justify-end'>
                                    <div className='rounded-l-lg text-left rounded-tr-lg p-2 px-3 text-white bg-[#361657]'>
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
                    <div onKeyDown={handleKeyDown} ref={ref} className='fixed bottom-20'>
                        <Picker onEmojiSelect={handleEmojiSelect} emojiSize={30} />
                    </div>
                )}


                <div className='flex fixed bottom-0 bg-gray-200 rounded-full m-2 items-center w-full'>
                    <button onClick={handleEmojiShow} className='flex-none px-1'>
                        <FaRegSmile style={{ fontSize: "40px", padding: "5px", color: "#3b3b3b" }} />
                    </button>
                    <label htmlFor="file-input" className='flex-none pr-1 cursor-pointer'>
                        <div>
                            <FiPaperclip style={{ fontSize: "36px", padding: "5px", color: "#3b3b3b" }} />
                        </div>
                    </label>
                    <input
                        ref={inputRef}
                        value={msg}
                        onKeyDown={(event) => {
                            event.key === "Enter" && sendMessage()
                        }}
                        className='p-2 w-2/3 mx-2 bg-gray-200 outline-none'
                        type="text" placeholder='Type a message'
                        onChange={(e) => { setMsg(e.target.value) }}
                    />
                    <button className='p-1 flex-none' onClick={sendMessage}>
                        <IoSend style={{ fontSize: "40px", padding: "5px" }} />
                    </button>
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
