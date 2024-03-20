import { Link } from "react-router-dom";
import "./Match.css";
import { useEffect, useRef, useState } from "react";
import { ref, set, update } from "firebase/database";
import { db } from "../App";
import { determineWinner } from "../Courts/Court";
export default function Matches({ courtNo, matches }) {
  return (
    <div className="match-container">
      <Link to={`court/${courtNo}`}>
        <b>Court: {courtNo}</b>
      </Link>
      {matches.map(
        ([{ player1, player2, scores, server, winner }, currGame], index) => (
          <>
            <Match
              player1={player1}
              player2={player2}
              score1={scores[0]}
              score2={scores[1]}
              server={server}
              winner={winner}
              courtNo={courtNo}
              key={player1 + player2}
              currGame={currGame}
              index={index}
            />
            {index % 2 == 1 && index != matches.length - 1 && (
              <div
                className="underline"
                key={index}
                style={{ border: "solid var(--font-color) 0.5px", width: "100%" }}
              />
            )}
          </>
        )
      )}
    </div>
  );
}

function Match({ player1, player2, score1, score2, server, winner, currGame, courtNo, index }) {
  const [score11, setScore1] = useState(score1);
  const [score22, setScore2] = useState(score2);
  const score1Ref = useRef(null);
  const score2Ref = useRef(null);

  useEffect(() => {
    setScore1(score1)
    setScore2(score2)
  }, [score1, score2])

  const enterHandler1 = () => {
    score2Ref.current.blur()
    setScore2("")
    score2Ref.current.focus()
  };

  const enterHandler2 = () => {
    score2Ref.current.blur()
  };

  const blurHandler = () => {
    const score111 = score11 === "" ? "0" : score11
    const score222 = score22 === "" ? "0" : score22
    const winner = determineWinner(score111, score222)
    update(ref(db, `courts/${parseInt(courtNo)-1}/games/${index}`), 
      {
        scores: [parseInt(score111), parseInt(score222)],
        server,
        winner
      }
    )
    if (currGame && winner !== 0) set(ref(db, `courts/${parseInt(courtNo)-1}/currentGame`), index + 1)
    else if (winner === 0) set(ref(db, `courts/${parseInt(courtNo)-1}/currentGame`), index)
    setScore1(score111)
    setScore2(score222)
  }

  return (
    <div
      className={`match-wrapper ${currGame && "green-game"}`}
      style={{ backgroundColor: currGame ? "var(--green-color)" : "" }}
    >
      <div
        className="match-player"
        style={{ textDecoration: winner == 1 ? "underline" : "" }}
      >
        <div className="match-players">{player1}</div>
        <div className="match-score">
          <div
            className="match-server"
            style={{ opacity: server == 0 ? 1 : 0 }}
          ></div>
          <input
            ref={score1Ref}
            onFocus={() => setScore1("")}
            onChange={(e) => setScore1(e.currentTarget.value)}
            onKeyUp={(e) => {if( e.key === "Enter" || e.key === " ") enterHandler1()}}
            onBlur={blurHandler}
            type="number"
            className="match-scoring"
            value={score11}
          />
        </div>
      </div>
      <div
        className="match-player"
        style={{ textDecoration: winner === 2 ? "underline" : "" }}
      >
        <div className="match-score">
          <input
            ref={score2Ref}
            onFocus={() => setScore2("")}
            onChange={(e) => setScore2(e.currentTarget.value)}
            onKeyUp={(e) => {if( e.key === "Enter" || e.key === " ") enterHandler2()}}
            onBlur={blurHandler}
            type="number"
            className="match-scoring"
            value={score22}
          />
          <div
            className="match-server"
            style={{ opacity: server == 1 ? 1 : 0 }}
          ></div>
        </div>
        <div className="match-players">{player2}</div>
      </div>
    </div>
  );
}
