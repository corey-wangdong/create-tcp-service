const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8888;

// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// net.createServer()有一个参数, 是监听连接建立的回调

net.createServer((socket) => {
  const remoteName = `${socket.remoteAddress}:${socket.remotePort}`;

  console.log(`${remoteName} 连接到本服务器`);

  // 设置接收消息
  socket.on('data', (data) => {
    console.log(`${remoteName} - ${data}`);
    // 给客户端发消息
    socket.write(`你说的是 ${data} 吗？`)
  })

  // 设置关闭
  socket.on('close', (data) => {
    console.log(`${remoteName} 连接关闭`);
  })
}).listen(PORT, HOST)