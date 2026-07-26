import { io } from "socket.io-client"
const App = () => {
  const socket = io("http://localhost:3000")
  return (
    <div>
      THIS IS APP
    </div>
  );
};

export default App;