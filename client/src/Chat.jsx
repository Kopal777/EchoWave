import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from "react-icons/io5";
import ScrollToBottom from 'react-scroll-to-bottom';
import { FaRegSmile } from "react-icons/fa";
import { FiPaperclip } from "react-icons/fi";
import { HiMiniUserGroup } from "react-icons/hi2";
import { IoCopyOutline } from "react-icons/io5";
import disconnect from './assets/logout.png';
import wallpaper from './assets/wallpaper.png';
import Picker from '@emoji-mart/react'
import useOutsideClick from './hooks/useOutsideClick';
import ActiveUsers from './ActiveUsers';
import { v4 as uuidv4 } from 'uuid';


function Chat({ socket, username, room }) {

    const { showEmoji, setShowEmoji, ref } = useOutsideClick(false);
    const [file, setFile] = useState();
    const [users, setUsers] = useState([]);
    const inputRef = useRef(null);
    const [msg, setMsg] = useState("");
    const [imageSrc, setImageSrc] = useState("");
    const [messageList, setMessageList] = useState([]);
    const [imageSources, setImageSources] = useState({});

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

    socket.on('allUsersData', (users) => {
        setUsers(users.users);
    })


    const sendMessage = async () => {
        if (msg !== "") {
            if (file) {
                const messageId = uuidv4();
                const messageData = {
                    id: messageId,
                    username: username,
                    room: room,
                    type: "file",
                    body: file,
                    time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
                    mimeType: file.type,
                    fileName: file.name,
                    imageSource: URL.createObjectURL(file)
                }
                await socket.emit("send_message", messageData);
                setMessageList((list) => [...list, messageData]);
                setImageSources((prevImageSources) => ({ ...prevImageSources, [messageId]: messageData.imageSource }));
                setMsg("");
                setFile();
                console.log(messageData.mimeType);
            }
            else {
                const messageData = {
                    username: username,
                    type: "text",
                    body: msg,
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
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setMsg(selectedFile.name);
            setFile(e.target.files[0]);
        } else {
            setFile(null);
        }
    }

    useEffect(() => {
        socket.off("recieve-message").on("recieve_message", (data) => {
            setMessageList((list) => [...list, data]);
            console.log("....", data)
        })
    }, [socket])

    const disconnectUser = () => {
        window.location.reload();
        socket.emit("disconnect");
    }

    const handleCopy = () => {
        console.log(room);
        navigator.clipboard.writeText(room);
        alert("Copied the text: " + room);
    }

    return (
        <div className='grid grid-cols-2 md:grid-cols-[0.65fr_2fr] h-screen'>

            {/* Active Members */}

            <div className='bg-gradient-to-b hidden md:block from-[#220d38] via-[#7f2287] to-[#551855]'>
                <div className='text-2xl flex items-center p-6 text-white font-semibold'>
                    <HiMiniUserGroup style={{ fontSize: "40px", marginRight: "8px" }} />
                    Active Members
                </div>
                <ActiveUsers users={users} />
            </div>

            <div style={{ backgroundImage: `url(${wallpaper})` }} className='bg-white lg:w-full w-screen'>

                {/* Top Bar */}

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

                {/* Chat Area */}
                <ScrollToBottom className='lg:h-[500px] h-[960px]'>

                    {messageList.map((messageContent) => {
                        const imageSource = imageSources[messageContent.id];
                        if (messageContent.type === "file") {


                            if (messageContent.mimeType.startsWith('application/')) {
                                if (messageContent.username == username) {
                                    console.log(imageSource);
                                    return <div className='m-1 mb-2 ml-[220px]'>
                                        <div className='flex justify-end'>
                                            <div className='rounded-l-lg text-left rounded-tr-lg p-2 px-3 text-white bg-[#3f1965]'>
                                                <a className='text-blue-400 underline' href={messageContent.imageSource} download={messageContent.fileName}>
                                                    {messageContent.fileName}
                                                </a>
                                                <div className='flex justify-between gap-2 text-xs text-slate-300'>
                                                    <div>
                                                        ~You
                                                    </div>
                                                    <div>
                                                        {messageContent.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                else {
                                    console.log("aaaaaa", messageContent.imageSource);
                                    return <div className='m-1 mb-2 mr-[220px]'>
                                        <div className='border rounded-t-lg text-left rounded-br-lg p-1 px-2 w-fit bg-[#bd8bee]'>
                                                <a className='text-blue-700 underline' href={messageContent.imageSource} download={messageContent.fileName}>
                                                    {messageContent.fileName}
                                                </a>
                                            <div className='flex justify-between gap-2 text-xs text-gray-600'>
                                                <div>
                                                    ~{messageContent.username}
                                                </div>
                                                <div>
                                                    {messageContent.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            }


                            else if (messageContent.mimeType.startsWith('image/')) {
                                if (messageContent.username == username) {
                                    return <div className='m-1 mb-2 ml-[220px]'>
                                        <div className='flex justify-end'>
                                            <div className='rounded-l-lg text-left rounded-tr-lg p-2 px-3 text-white bg-[#3f1965]'>
                                                <img className='h-auto w-[450px]' src={imageSource} alt="" />
                                                <div className='flex justify-between gap-2 text-xs text-slate-300'>
                                                    <div>
                                                        ~You
                                                    </div>
                                                    <div>
                                                        {messageContent.time}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                                else {
                                    return <div className='m-1 mb-2 mr-[220px]'>
                                        <div className='border rounded-t-lg text-left rounded-br-lg p-1 px-2 w-fit bg-[#bd8bee]'>
                                            <img className='h-auto w-[450px]' src={messageContent.imageSource} alt="" />
                                            <div className='flex justify-between gap-2 text-xs text-gray-600'>
                                                <div>
                                                    ~{messageContent.username}
                                                </div>
                                                <div>
                                                    {messageContent.time}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }
                            }

                        }

                        if (username == messageContent.username) {
                            console.log("message in");
                            return <div className='m-1 mb-2 ml-[220px]'>
                                <div className='flex justify-end'>
                                    <div className='rounded-l-lg text-left rounded-tr-lg p-2 px-4 text-white bg-[#3f1965]'>
                                        {messageContent.body}
                                        <div className='flex justify-between gap-2 text-xs text-slate-300'>
                                            <div>
                                                ~You
                                            </div>
                                            <div>
                                                {messageContent.time}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        }
                        else {
                            console.log("message out");
                            return <div className='m-1 mb-2 mr-[220px]'>
                                <div className='border rounded-t-lg text-left rounded-br-lg p-1 px-2 w-fit bg-[#bd8bee]'>
                                    {messageContent.message}
                                    <div className='flex justify-between gap-2 text-xs text-gray-600'>
                                        <div>
                                            ~{messageContent.username}
                                        </div>
                                        <div>
                                            {messageContent.time}
                                        </div>
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

                {/* Bottom Bar */}

                <div className='flex fixed bottom-0 bg-gray-200 rounded-full m-2  items-center lg:w-[74%] w-[100%] '>
                    <button onClick={handleEmojiShow} className='flex-none px-1'>
                        <FaRegSmile style={{ fontSize: "40px", padding: "5px", color: "#3b3b3b" }} />
                    </button>
                    <label className='cursor-pointer flex items-center justify-center border bg-transparent rounded-2xl text-gray-600 p-2'>
                        <input multiple type="file" className='hidden' onChange={selectFile} />
                        <div className='mr-1 text-[28px] text-[#3b3b3b]'><FiPaperclip /></div>
                    </label>
                    <input
                        ref={inputRef}
                        value={msg}
                        onKeyDown={(event) => {
                            event.key === "Enter" && sendMessage()
                        }}
                        className='p-2 w-[87%] mx-2 bg-gray-200 outline-none'
                        type="text"
                        placeholder='Type a message'
                        onChange={(e) => { setMsg(e.target.value) }}
                    />
                    <button className='p-1 flex-none' onClick={sendMessage}>
                        <IoSend style={{ fontSize: "40px", padding: "5px" }} />
                    </button>
                </div>
            </div>

        </div>

    )
}

export default Chat
