const net = require('net');

const HOST = '127.0.0.1';
const PORT = 8888;

// net.Socket,
const sock = net.connect(
  {
    port: 9000,
    host: '127.0.0.1',
  },
  function () {
    console.log('connected to server!');
  }
);

// 连接成功调用的事件
sock.on('connect', function () {
  console.log('connect success');
  // 同步服务端，客户端基础信息
  const info = {
    type: 'sync',
    clientName: 'Client-2',
    message: '同步基础信息',
  };
  const message = `${info.clientName}向服务端同步基础信息${info.message}`;
  console.log(message);
  sock.write(JSON.stringify(info), 'utf8');

  // 延迟发送数据
  setTimeout(() => {
    // 消息模板
    const info = {
      type: 'info',
      clientName: 'Client-2',
      message: '222',
    };
    const message = `${info.clientName}向服务端发送信息：${info.message}`;
    console.log(message);
    sock.write(JSON.stringify(info), 'utf8');
  }, 3000);
});

// 当有数据发生的时候，调用;
sock.on('data', function (data) {
  console.log('Client-2 接收到来自服务端的信息：', data.toString('utf-8'));
});

// 有错误发生调用的事件
sock.on('error', function (e) {
  console.log('error', e);
});

// socket关闭的事件
sock.on('close', function () {
  console.log('close');
});

// 对方发送了关闭数据包过来的事件
sock.on('end', function () {
  console.log('end');
});


