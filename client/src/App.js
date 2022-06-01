import './App.css'
import Chat from './Chat'
import { useState } from 'react'
import io from 'socket.io-client'

const socket = io.connect('http://localhost:3001')

function App() {
  const [name, setName] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  const set_room = () => {
    if (name !== '' && room !== '') {
      socket.emit('set_room', room, name);
      setShowChat(true);
    }
  };

  return (
    <div className='App'>
      {!showChat ? (
        <div className='mainContainer'>
          <h1>Ron-Paul ChatRoom</h1>
          <input
            type='text'
            placeholder='Enter Name'
            onChange={(event) => {
              setName(event.target.value)
            }}
          />
          <input
            type='text'
            placeholder='Enter Room'
            // value={room}
            onChange={(event) => {
              setRoom(event.target.value)
              // this.setState({
              //   room: room
              // })
            }}
          />
          <button
            onClick={set_room}
          >
            Join Now</button>
        </div>
      ) : (
        <Chat
          socket={socket}
          name={name}
          room={room}
        />
      )}
    </div>
  );
}

export default App