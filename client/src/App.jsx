import { useEffect } from "react";
import { io } from "socket.io-client"
import { Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useMemo } from "react";

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), [])
  const [message, setMessage] = useState('')
  const handleSubmit = (e) => {
    e.preventDefault()
    socket.emit('message', message)
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id)
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
      <Typography>
        Welcome to Socket.io
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          id="outlined-basic"
          label="Outlined"
          variant="outlined" />
        <Button variant="contained" color="primary" type="submit">Send</Button>
      </form>
    </Container>
  );
};

export default App;