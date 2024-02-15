import {React, useState,useEffect} from 'react'
import { useSocket } from './context/SocketProvider';
import peer from './peer';

export default function App() {
const [connect,setConnect] = useState('');
// eslint-disable-next-line no-unused-vars
const [localSocketId,setlocalSocketId] = useState();
const [download,setDownload] = useState(false);
const [file,setFile] = useState(null)
const socket = useSocket();
const [datachanell,setDatachannell] = useState();


let dc



const handleConnect = async (e)=>{
  e.preventDefault();
   dc =  peer.peer.createDataChannel("send-channel");
  setDatachannell(dc);
  const offer= await peer.getOffer();
  console.log("data channel created!!!!",dc);
   dc.onopen = e => console.log("connection open!!!!");
   dc.onclose =e => console.log("closed!!!!!!");
  
  console.log("localId:",localSocketId)
  console.log("connect:",connect)
  socket.emit("remoteSocketId",{to:connect,offer});
  setConnect('')
  // createDataChannel();
}




// eslint-disable-next-line react-hooks/exhaustive-deps
function printSocketId(data){ 
  setlocalSocketId(data);
}
// eslint-disable-next-line react-hooks/exhaustive-deps
async function handleOffer({from,offer}){ 
  console.log("remoteSocketid:",from);
  console.log("offer-recieved:",offer);
  const answer = await peer.getAnswer(offer);
  console.log("answer:",answer,"remoteSocketId:",from);
  socket.emit("send-ans",{to:from,answer})
  peer.peer.ondatachannel = e => {
    console.log("dsdsds!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!11")
    const receiveChannel = e.channel;
    console.log("receive channel!!!!!", receiveChannel);
    receiveChannel.onopen = e => console.log("open!!!!");
    receiveChannel.onclose = e => console.log("closed!!!!!!");
    peer.peer.channel = receiveChannel;
  }
  
  dc.addEventListener('message', ev => {
    console.log('working')
      if (typeof ev.data == 'object') {
          const a = document.createElement('a');
          const blob = new Blob([ev.data]);
          const obj = URL.createObjectURL(blob);
          a.href = obj;
          a.download = 'rec.png';
          a.click()
      }     
    });
    
 
}
async function handleAnswer(answer){ 
  console.log("answer-recieved:",answer);
  await peer.setLocalDesc(answer);
}

const handleFileChange =  (e)=>{ 
  const file = e.target.files[0];
  setFile(file)
  
}

 async function sendFile(e) {

  if (dc) {
    const fb = await file.arrayBuffer();
    console.log("fileBuffer",fb)
    console.log(dc)
  
  } else {
    console.error("Data channel is not defined.");
  }
}


let obj


// rec.onmessage = e=>{ 
//   if(e.data==="object")
//   {
//       setDownload(true);
//       const blob = new Blob([e.data]);
//        obj = URL.createObjectURL(blob);
//        console.log("message recieved:",obj);
//   }
// }


useEffect(()=>{ 
  socket.on("socket-id",printSocketId);
  socket.on("remoteSocket-id",handleOffer);
  socket.on("send-ans-rec",handleAnswer);
  return()=>{
    socket.off("socket-id",printSocketId)
    socket.off("remoteSocket-id",handleOffer);
    socket.off("send-ans-rec",handleAnswer)
  }
},[socket,printSocketId,handleOffer])




return (
  <div style={styles.container}>
    <h1>{localSocketId}</h1>
    <input
      style={styles.input}
      onChange={(e) => setConnect(e.target.value)}
      value={connect}
      placeholder="Enter a value"
    />
    <button style={styles.button}   onClick={handleConnect}>
      Connect
    </button>
    <input style={styles.input} type="file" onChange={handleFileChange} />
    <button onClick={sendFile}>Upload</button>
    {download && (
        <a href={obj} download="rec.png">
          <button>Download File</button>
        </a>
      )}
  </div>
);
}

const styles = {
container: {
  maxWidth: '400px',
  margin: 'auto',
  padding: '20px',
  textAlign: 'center',
},
input: {
  width: '100%',
  marginBottom: '10px',
  padding: '8px',
},
button: {
 
  backgroundColor: '#4caf50',
  color: 'white',
  padding: '10px',
  border: 'none',
  cursor: 'pointer',
  width: '100%',
},
};









