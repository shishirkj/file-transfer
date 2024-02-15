class PeerService{ 
    constructor() {
        if (!this.peer) {
          this.peer = new RTCPeerConnection({
            iceServers: [
              {
                urls: [
                "  stun:stun.stunprotocol.org:3478",
                  "stun:global.stun.twilio.com:3478",
                ],
              },
            ],
          });
        }
      }


      async getOffer(){ 
            if(this.peer)
            { 
                const offer = await this.peer.createOffer();
                await this.peer.setLocalDescription(new RTCSessionDescription(offer));
                return offer
            }
      }   
      async getAnswer(offer){
        if(this.peer)
        {
          await this.peer.setRemoteDescription(offer);
          const ans = await this.peer.createAnswer();
           await this.peer.setLocalDescription(new RTCSessionDescription(ans));
           return ans;
        }
      } 
      
      async setLocalDesc(answer){ 
        if(this.peer)
        {
          console.log("setting answer this dside")
        await this.peer.setRemoteDescription(new RTCSessionDescription(answer));
        console.log("answer set")
        }
      }
        
}


export default new PeerService();