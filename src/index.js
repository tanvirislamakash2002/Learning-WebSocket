import express from "express";
import http from "http";
import { matchRouter } from "./routes/matches.js";
import { attachWebSocketServer } from "./ws/server.js";
import { securityMiddleware } from "./arcjet.js";
import { commentaryRouter } from "./routes/commentary.js";

const DEFAULT_PORT = Number(process.env.PORT) || 8000;
const HOST = process.env.HOST || "0.0.0.0";
const app = express();
const server = http.createServer(app);

const requestedPort = Number(process.env.PORT) || 8000;
const portToUse = requestedPort === 8000 ? 8001 : requestedPort;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World" });
});

app.use(securityMiddleware());

app.use("/matches", matchRouter);
app.use("/matches/:id/commentory", commentaryRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

function startServer(port) {
  const listener = server.listen(port, HOST, () => {
    const baseUrl = `http://localhost:${port}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket endpoint is ws://localhost:${port}/ws`);
  });

  listener.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      const nextPort = port + 1;
      console.warn(`Port ${port} is already in use. Trying ${nextPort} instead.`);
      listener.close(() => startServer(nextPort));
    } else {
      console.error(error);
      process.exit(1);
    }
  });
}

startServer(portToUse);