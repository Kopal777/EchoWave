import React, { useDebugValue, useEffect, useState } from 'react'
import { FaCircle } from "react-icons/fa";

function ActiveUsers({ users }) {
    const [colors, setColors] = useState([]);

    useEffect(()=>{
        const getRandomColor =()=>{
            const letters = '0123456789ABCDEF';
            let color = '#';
            for(let i=0; i<6; i++){
                color += letters[Math.floor(Math.random()*16)];
            }
            return color;
        }
        const colorsArray = users.map(()=>getRandomColor());
        setColors(colorsArray);
    }, [users]);

    

    return (
        <div>
            {users ? (
                <div className='ml-6'>
                    {users.map((user, index) => (
                        <div className='text-[#2f2f2f] my-4 mr-5 p-2 rounded-xl shadow-inner shadow-slate-800 border-white border-2 bg-[#a67bd3] text-xl font-medium flex items-center justify-between'>
                            <div className='flex items-center'>
                                <div className='border-white shadow-slate-700 shadow-inner text-4xl text-white px-[23px] py-[9px] mr-2 rounded-full border-2' style={{backgroundColor: colors[index]}}>{user.username[0]}</div>
                                {user.username}
                            </div>
                            <div>
                                <FaCircle style={{ color: "#11df1c", padding: "2px", marginRight: "7px", position: "relative", top: "2.5px" }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : null
            }
        </div>
    )
}

export default ActiveUsers
