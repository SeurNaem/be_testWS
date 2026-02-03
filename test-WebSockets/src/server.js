const http = require("http");
const WebSocket = require("ws");

const PORT = process.env.PORT || 8080;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

server.listen(PORT, () => {
  console.log(`WebSocket server chạy tại ws://localhost:${PORT}`);
});

let clientCount = 0;

wss.on("connection", (ws) => {
  clientCount++;
  const clientId = clientCount;
  console.log(`Client ${clientId} đã kết nối. Tổng: ${wss.clients.size}`);

  // Thông báo cho tất cả client về người dùng mới
  const notification = `System: Người dùng ${clientId} đã vào chat (${wss.clients.size} người online)`;
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(notification);
    }
  });

  ws.on("message", (message) => {
    const msgText = message.toString();
    console.log(`Client ${clientId}:`, msgText);

    // Broadcast tin nhắn cho tất cả client
    const chatMessage = `Người dùng ${clientId}: ${msgText}`;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(chatMessage);
      }
    });
  });

  ws.on("close", () => {
    console.log(`Client ${clientId} ngắt kết nối`);
    const leaveNotification = `System: Người dùng ${clientId} đã rời khỏi chat (${wss.clients.size} người online)`;
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(leaveNotification);
      }
    });
  });
});
