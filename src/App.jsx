import { useState } from 'react'
import './App.css'

function App() {
  const [leftCount, setLeftCount] = useState(0)
  const [rightCount, setRightCount] = useState(0)
  const [server, setServer] = useState(false)
  const [video, setVideo] = useState(null)

  const upHandler = (setCount, left) => {
    setServer(!left)
    setCount(prev => prev + (prev >= 0 && prev < 30 ? 1 : 0))
  }

  const downHandler = (setCount, left) => {
    setCount(prev => prev + (prev > 0 && prev < 30 ? -1 : 0))
  }

  const resetHandler = () => {
    setLeftCount(0)
    setRightCount(0)
    setServer(0)
  }

  const challengeHandler = (wide) => {
    setTimeout(() => {
      setVideo(
        <video className='video' src={`/assets/${Math.random() < 0.5 ? "in" : "out"}_${wide}.mp4`} autoPlay muted>
        </video>
      )
    }, 500)
    setTimeout(() => {
      setVideo(null)
    }, 10000);
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
        <button onClick={resetHandler} style={{fontSize: '2em', padding: "0px 20px 5px"}}>↺</button>
       </div>
        <div className='side-buttons'>
          <button onClick={() => setServer(true)}>△</button>
          <button onClick={() => challengeHandler("wide")}><u>!!</u></button>
          <button onClick={() => challengeHandler("long")}>!</button>
          <button onClick={() => downHandler(setRightCount, false)}>▼</button>
        </div>
      </div>
      <div className="popup">
        {video}
      </div>
    </>
  )
}

export default App
