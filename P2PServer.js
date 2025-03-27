import net from "net"

let usernames = new Set()
let clients = new Set()

function broadcastClientMessage(socket, message){
    for (const client of clients){
        if (client !== socket){
            client.write('${message}\n')
        }
    }
}

function newName(socket, name){
    if (usernames.has(name)){
        socket.write("Username taken. Please try again")
        return null
    }
    usernames.add(name)
    clients.add(socket)
    broadcastClientMessage(socket, '${name} has joined the chat!')
    return name
}

function handleClientLeaving(socket, name){
    console.log('${name} disconnected')
    usernames.delete(name)
    clients.delete(socket)
    broadcastClientMessage(socket, '${name} has left the chat!')
}

net
.createServer((socket) => {
    let name = null
    console.log('Connection from ${socket.remoteAddress} port ${socket.remotePort}')
    socket.write('Welcome to the chat! Please enter your name: \n')
    socket.on("data", (buffer) =>{
        const message = buffer.toString("utf-8").trim()
        if(!name){
            name = tryAcceptName(socket, message)
        } else {
            broadcastClientMessage(socket, '${name}: ${message}')
        }
    })
    socket.on('end', () => handleClientLeaving(socket, name))
}
)


server.listen(59090, () => {
    console.log("Running")
})