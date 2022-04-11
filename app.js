//1.input nodejs-websocket package
const ws= require('nodejs-websocket')

//add type label
const access=0
const exit=1
const msg=2

//type：message type. 0：client comming message. 1：client exiting message. 2：normal talking message
//msg：message
//time：intime 

//mark client numbers
let count=0

//Port
const PORT=3001
//2.Create a websocket server
//2.1 Once client connect with server，function would be excuated，server would assign a connect object for every client
const server=ws.createServer (connect=>{
    console.log('There is a client connecting')
    count++
    //define the name for every client
    connect.userName= `Client${count}`

    

    //broadcast the connectiong information for every client
    broadcast({
       type:access,
       msg:`${connect.userName} access to the chatroom`,
       time:new Date().toLocaleTimeString()
    })



    //2.11 Once server receive messages form client，this text event would be triggered
    connect.on('text',data=>{
    //Server woud broadcast messages to every client.So we realize intime chating function.
    broadcast({
        type:msg,
        msg:connect.userName+':'+data,
        time:new Date().toLocaleTimeString()
    })


    console.log('Received message from '+connect.userName+':'+data)
    
    })


    //2.12 Once there is a client exit the chatroom,websocket server would trigger this close event.
    connect.on('close',()=>{
        console.log(connect.userName+'leave the chatroom')
        count--
    
    //Websocket server broadcast the exited client message to every other client.
        broadcast({
            type:exit,
            msg:`${connect.userName} leave the chatroom`,
            time:new Date().toLocaleTimeString()
        })
    })
      //A error event to report some abnormal connections 
    connect.on('error',()=>{
        console.log('Connection is abnormal')
    })
})


//Definet the broadcast function to send the message to every client which has subscribed this websocket server
function broadcast(msg){
//server.connections mean every client connection object.
    server.connections.forEach(item => {
        //msg is an object.So we need to transform it to a string message.
        item.send(JSON.stringify(msg))
    }); 
}

//websocket server listen particular port.
server.listen(PORT,()=>{
    console.log('Websocket Server successfully run and lisent the Port:'+PORT)
})


