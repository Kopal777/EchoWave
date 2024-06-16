const users = [];

function addUser(id, username, room){

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();
    // const existingUser = users.find((user)=> user.room ===room && user.username === username)
    // if (!username || !room) return { error: 'Username and room are required' };
    // if (existingUser) return { error: 'Username is taken.'}

    const user = {id, username, room};
    users.push(user);
    return {user};

}

function removeUser(id){

    const index = users.findIndex((user)=> user.id === id);
    if (index !== -1){
        const removedUser = users.splice(index, 1)[0];
        console.log("Remaining users:", users);
        return removedUser;
    }
}

function getUsersInRoom(room){
    return users.filter((user)=> user.room === room)
}

module.exports = {addUser, getUsersInRoom, removeUser};