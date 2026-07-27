import { useEffect } from "react";
import { io } from "socket.io-client"
import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), [])
  const [message, setMessage] = useState('')
  const [socketId, setSocketId] = useState('')
  const [room, setRoom] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', { message, room })
    setMessage("")
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id)
      console.log("connected", socket.id)
    })
    socket.on("receive-message", (data) => {
      console.log(data)
    })
    socket.on("welcome", (s) => {
      console.log(s)
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <Container>
      <Typography variant="h3" component='div' gutterBottom>
        Welcome to Socket.io
      </Typography>
      <Typography variant="h5" component='div' gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined" />
        <TextField
          value={room}
          onChange={e => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined" />
        <Button variant="contained" color="primary" type="submit">Send</Button>
      </form>
    </Container>
  );
};

export default App;