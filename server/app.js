import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";

const port = 3000
const app = express()
const server = createServer(app)

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        method: ["GET", "POST"],
        credentials: true
    }
})

app.use(cors({
    origin: "http://localhost:5173",
    method: ["GET", "POST"],
    credentials: true
}))

app.get("/", (req, res) => {
    res.send("Hello world")
})

io.on("connection", (socket) => {
    console.log("user connected")
    console.log("Id", socket.id)
})

server.listen(port, () => {
    console.log(`socket server is running on port ${port}`)
})