const net = require('net');

const HOST = '127.0.0.1';
const PORT = 9000;
const clients = [];
// 创建一个TCP服务器实例，调用listen函数开始监听指定端口
// net.createServer()有一个参数, 是监听连接建立的回调

const server = net.createServer((socket) => {
  const remoteName = `${socket.remoteAddress}:${socket.remotePort}`;
  socket.name = remoteName;

  // 存储信息
  storeClient(socket);

  console.log('[客户端已接入]: ', socket.name);
  console.log(
    '[目前已接入的所有客户端]: ',
    clients.map(m => m.sessionId)
  );

  // 设置接收消息
  socket.on('data', (data) => {
    try {
      // 约束固定的消息模板，这里data约定是JSON格式的数据
      const _data = JSON.parse(data);
      const { type, clientName, message } = _data;
      if (type == 'sync') {
        // 同步信息
        storeClient(socket, clientName);
      } else if (type == 'info') {
        // 消息互传
      }
    } catch (err) {
      console.log('err---', err);
    }
  })

  // 客户端断开连接的时候处理,
  // 提示用户断线离开了，删除客户端连接池
  socket.on('close', (data) => {
    const index = clients.findIndex(m => m.sessionId == client.name);
    if (index >= 0) clients.splice(index, 1);
    console.log(
      '【all clients】',
      clients.map(m => m.sessionId)
    );
    console.log(client.name, '下线了');
  })

  socket.write("欢迎来到疯狂星期四");
})

// 广播
const broadcast = ({ clientName, message }) => {
  // 定向广播
  if (clientName) {
    const client = clients.find(m => m.name == clientName);
    client && client.client.write(message);
  } else {
    // 群发
    clients.map(m => {
      m.client.write(message);
    });
  }
};

// 测试
let testTimeout = null;
server.on('connection', function () {
  clearTimeout(testTimeout);
  testTimeout = setTimeout(() => {
    console.log('通知所有人：今天是疯狂星期四');
    broadcast({ message: '\n\r今天是疯狂星期四' });

    console.log('通知Client-1: 去买蛋挞');
    broadcast({ clientName: 'Client-1', message: '\n\r你去买蛋挞' });

    console.log('通知Client-2: 买汉堡🍔');
    broadcast({ clientName: 'Client-2', message: '\n\r你去买汉堡🍔' });
  }, 10000);
});

server.on('listening', function () {
  console.log('等待连接...');
});

// 端口监听
server.listen({
  port: 9000,
  host: '127.0.0.1',
});

// 监听发生错误的时候调用
server.on('error', function () {
  console.log('listen error');
});

server.on('close', function () {
  console.log('server stop listener');
});


server.listen({ port: PORT, host: HOST }, () => {
  console.log('tcp 服务已启动');
})


// 存储
function storeClient(client, name = '') {
  if (!client || !client.remoteAddress || !client.remotePort) return;
  const { remoteAddress, remotePort } = client;
  const sessionId = `${remoteAddress}:${remotePort}`;
  const existClient = clients.find(m => m.sessionId == sessionId);
  // 如果不存在，存储实例
  if (!existClient) {
    clients.push({
      name,
      sessionId,
      client,
    });
  } else {
    // 如果存在，更新
    existClient.client = client;
    existClient.name = name;
  }
}