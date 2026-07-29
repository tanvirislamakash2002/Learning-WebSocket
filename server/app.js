import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";


const secretKeyJWT = "oidshniujasdfhniuh"

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

app.get("/login", (req, res) => {
    const token = jwt.sign({ _id: "aaslkdfjoih" }, secretKeyJWT)
    res
        .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
        .json({
            message: "login success"
        })
})


const user = true;
io.use((socket, next) => {
    if (user) next()
})

io.on("connection", (socket) => {
    console.log("user connected")
    console.log("Id", socket.id)
    // socket.emit("welcome", `welcome to the server`)
    // socket.broadcast.emit("welcome", `${socket.id} joined the server`)

    socket.on("message", ({ room, message }) => {
        console.log({ room, message })
        // io.emit("receive-message", data)
        // socket.broadcast.emit("receive-message", data)
        socket.to(room).emit("receive-message", message) // socket & io will work like same
        // io.to(room).emit("receive-message", message)
    })

    socket.on("join-room", (room) => {
        socket.join(room)
        console.log(`user joined room ${room}`)
    })
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id)
    })
})

server.listen(port, () => {
    console.log(`socket server is running on port ${port}`)
})