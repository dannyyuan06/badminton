import { useEffect, useState } from 'react'
import './App.css'
import { io } from 'socket.io-client';
const socket = io('192.168.1.191:3001');

function App() {
  const [leftCount, setLeftCount] = useState(0)
  const [rightCount, setRightCount] = useState(0)
  const [server, setServer] = useState(false)
  const [video, setVideo] = useState(null)

  useEffect(() => {
    socket.on('counter', (newCounter) => {
      const [leftCountt, rightCountt, servert, videot] = JSON.parse(newCounter)
      setLeftCount(leftCountt);
      setRightCount(rightCountt)
      setServer(servert)
      setVideo(videot)
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.emit('updateCounter', JSON.stringify([leftCount, rightCount, server, video]));
  }, [leftCount, rightCount, server, video])

  const upHandler = (setCount, left) => {
    setServer(!left)
    setCount(prev => prev + (prev >= 0 && prev < 30 ? 1 : 0))
  }

  const downHandler = (setCount, left) => {
    setCount(prev => prev + (prev > 0 && prev <= 30 ? -1 : 0))
  }

  const resetHandler = () => {
    setLeftCount(0)
    setRightCount(0)
    setServer(0)
  }

  const challengeHandler = (wide) => {
    setTimeout(() => {
      setVideo(`/assets/${Math.random() < 0.5 ? "in" : "out"}_${wide}.mp4`)
    }, 500)
    setTimeout(() => {
      setVideo("")
    }, 13000);
  }

  return (
    <>
      <div className='counter-container'>
       <button onClick={() => upHandler(setLeftCount, true)} style={!server ? {borderWidth: 2} : {}}>{leftCount}</button>
       <button onClick={() => upHandler(setRightCount, false)} style={server ? {borderWidth: 2}: {}}>{rightCount}</button>
      </div>
      <div className='decrement-container'>
        <div className='side-buttons'>
          <button onClick={() => downHandler(setLeftCount, true)}>▼</button>
          <button onClick={() => challengeHandler("long")}>!</button>
          <button onClick={() => challengeHandler("wide")}><u>!!</u></button>
          <button onClick={() => setServer(false)}>△</button>
        </div>
       <div className='side-buttons'>
        <button onClick={resetHandler} style={{fontSize: '2em', padding: "5px 20px 4px"}}>↺</button>
       </div>
        <div className='side-buttons'>
          <button onClick={() => setServer(true)}>△</button>
          <button onClick={() => challengeHandler("wide")}><u>!!</u></button>
          <button onClick={() => challengeHandler("long")}>!</button>
          <button onClick={() => downHandler(setRightCount, false)}>▼</button>
        </div>
      </div>
      <div className="popup">
        {
          video && 
          <video className='video' src={video} autoPlay muted>
        </video>
        }
      </div>
    </>
  )
}

export default App
