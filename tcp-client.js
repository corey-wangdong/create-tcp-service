
const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8888;

const client = new net.Socket();
const serverName = `${HOST}:${PORT}`;
let count = 0;

client.connect(PORT, HOST, () => {
  console.log(`成功连接到 ${serverName}`);

  // 向服务端发送数据
  const timer = setInterval(() => {
    if (count > 5) {
      client.write('我没事了, 告辞');
      clearInterval(timer);
      return;
    }
    client.write('他二舅' + count++);
  }, 1000)
});

// 接收消息
client.on('data', (data) => {
  console.log(`${serverName} - ${data}`);
})


// 关闭事件
client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (error) => {
  console.log(error);
})