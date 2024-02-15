import http from 'http'
import { Server } from 'socket.io'

const server = http.createServer();

const io = new Server(server,{
    cors:true
})

io.on("connection",(socket)=>{
    socket.emit("socket-id",socket.id)
   console.log(socket.id);
   socket.on("remoteSocketId",({to,offer})=>{ 
    io.to(to).emit("remoteSocket-id",{from:socket.id,offer});
   })
 
   socket.on("send-ans",({to,answer})=>{ 
    io.to(to).emit("send-ans-rec",answer)
   })
 })


const PORT = 8000;
server.listen(PORT,() => console.log(`🚀 Server started at PORT ${PORT}`))