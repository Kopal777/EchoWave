import React from 'react'
import { FaCircle } from "react-icons/fa";

function ActiveUsers({ users }) {

    return (
        <div>
            {users ? (
                <div className='ml-6'>
                    {users.map((user) => (
                        <div className='text-white text-xl font-medium flex items-center p-2'>
                            <FaCircle style={{color: "#0fb809", padding:"2px", marginRight:"7px"}}/>
                            {user.username}
                        </div>
                    ))}
                </div>
            ) : null
            }
        </div>
    )
}

export default ActiveUsers
