import { getDatabase, onValue, ref, set, update } from "firebase/database";
import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import NoSleep from 'nosleep.js';
import './Court.css'
import { db } from "../App";

export default function Court() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("")
  const [player1Count, setPlayer1Count] = useState(0)
  const [player2Count, setPlayer2Count] = useState(0)
  const [server, setServer] = useState(false)
  const [switched, setSwitched] = useState(false)
  const [clientSwitch, setClientSwitch] = useState(false)
  const { courtId } = useParams()
  const winner = determineWinner(player1Count, player2Count)
  const currentCourtRef = useRef(0)
  const loaded = useRef(false)

  useEffect(() => {
    const noSleep = new NoSleep();
    noSleep.enable();
    return () => noSleep.disable();
  }, []);

  useEffect(() => {
      const database = ref(db, `courts/${parseInt(courtId)-1}`)
      return onValue(database, (snapshot) => {
        const data = snapshot.val();
        const index = data.currentGame
        currentCourtRef.current = index
        const {player1, player2, scores, server} = data.games[index]
        setPlayer1(player1);
        setPlayer2(player2);
        setPlayer1Count(scores[0])
        setPlayer2Count(scores[1])
        setServer(server == 1)
        setSwitched(data.switch)
        loaded.current = true
      })
    }, [])

  useEffect(() => {
    if (!loaded.current) return
    const updates = {
      "/scores": [player1Count, player2Count],
      "/server": +server,
    }
    update(ref(db, `courts/${parseInt(courtId)-1}/games/${currentCourtRef.current}`), updates)
  }, [player1Count, player2Count, server])

  useEffect(() => {
    set(ref(db, `courts/${parseInt(courtId)-1}/switch`), switched)
  }, [switched])

  const upHandler = (setCount, left) => {
    if (winner !== 0) return
    setServer(!left)
    setCount(prev => prev + (prev >= 0 && prev < 30 ? 1 : 0))
  }

  const downHandler = (setCount, left) => {
    setCount(prev => prev + (prev > 0 && prev <= 30 ? -1 : 0))
  }

  const resetHandler = () => {
    setPlayer1Count(0)
    setPlayer2Count(0)
    setServer(0)
  }

  const confirmScore = () => {
    set(ref(db, `courts/${parseInt(courtId)-1}/games/${currentCourtRef.current}/winner`), winner)
    set(ref(db, `courts/${parseInt(courtId)-1}/currentGame`), currentCourtRef.current + 1)
  }

  const finalSwitch = switched != clientSwitch;

  return (
    <div className='counter-wrapper'>
      <div className='counter-buttons'>
        <Link to="/" className='counter-home-btn'>
          Home
        </Link>
        <div>
          {finalSwitch ?  player2 : player1}
        </div>
        <button className='counter-switch' onClick={() => setSwitched(prev => !prev)}>
          Switch sides
        </button>
        <div>
          {finalSwitch ? player1 : player2}
        </div>
        <button onClick={confirmScore} className='counter-right-btn' style={{opacity: winner == 0 ? "0": "1"}}>
          Confirm Score
        </button>
      </div>
      <div className='counter-container' style={finalSwitch ? {flexDirection: "row-reverse"} : {}}>
       <button onClick={() => upHandler(setPlayer1Count, true)} style={{borderWidth: !server ? 2 : 0, backgroundColor: winner == 1 ? "var(--green-color)": ""}}>{player1Count}</button>
       <button onClick={() => upHandler(setPlayer2Count, false)} style={{borderWidth: server ? 2 : 0, backgroundColor: winner == 2 ? "var(--green-color)": ""}}>{player2Count}</button>
      </div>
      <div className='decrement-container' style={finalSwitch ? {flexDirection: "row-reverse"} : {}}>
          <button onClick={() => downHandler(setPlayer1Count, true)}>▼</button>
          <button className='counter-server' onClick={() => setServer(false)}>Set Server</button>
          <div style={{marginRight: "auto", marginLeft: "auto", display: "flex", gap: 10}}>
            <button className="counter-reset" onClick={resetHandler}>↺</button>
            <button onClick={() => setClientSwitch(prev => !prev)}>Swap</button>
          </div>
          <button className='counter-server' onClick={() => setServer(true)}>Set Server</button>
          <button onClick={() => downHandler(setPlayer2Count, false)}>▼</button>
      </div>
    </div>
  )
}


export function determineWinner(score1, score2) {
  if (score1 >= 21 && score1 - score2 >= 2 || score1 == 30) return 1;
  if (score2 >= 21 && score2 - score1 >= 2 || score2 == 30) return 2;
  return 0;
}