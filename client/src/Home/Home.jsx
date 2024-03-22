import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useRef, useState } from "react";
import { db } from "../App";
import { jse, tse } from "../matches/testingData";
import Matches from "./Match";
import "./Home.css";
import LeaderboardPlayer from "./Leaderboard";
import NoSleep from "nosleep.js";

export default function Home() {
  const [courtScores, updateCourtScores] = useState([]);
  const leaders = getLeaders(courtScores);
  const nextGames = getNextGames(courtScores);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    const initialValue = JSON.parse(saved);
    return initialValue;
  });

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      elementRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.style.setProperty(
        "--background-background-color",
        "#ffffff"
      );
      document.documentElement.style.setProperty("--green-color", "#A6D6C9");
      document.documentElement.style.setProperty("--font-color", "black");
      document.documentElement.style.setProperty(
        "--background-color",
        "#eeeeee"
      );
      document.documentElement.style.setProperty(
        "--button-background-color",
        "#e7e7e7"
      );
      document.documentElement.style.setProperty("--yellow-color", "#F7D117");
    } else {
      document.documentElement.style.setProperty(
        "--background-background-color",
        "#242424"
      );
      document.documentElement.style.setProperty("--green-color", "#4e7e71");
      document.documentElement.style.setProperty("--font-color", "white");
      document.documentElement.style.setProperty(
        "--background-color",
        "#1a1a1a"
      );
      document.documentElement.style.setProperty(
        "--button-background-color",
        "#868686"
      );
      document.documentElement.style.setProperty("--yellow-color", "#F7D117");
    }
  }, [darkMode]);

  useEffect(() => {
    const noSleep = new NoSleep();
    noSleep.enable();
    return () => noSleep.disable();
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };
    setIsFullscreen(document.fullscreenElement !== null);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const database = ref(db, "/courts");
    return onValue(database, (snapshot) => {
      const data = snapshot.val();
      const currentScores = data.map((court) => ({
        matches: court.games.map((game, index) => [
          game,
          index == court.currentGame,
        ]),
      }));
      updateCourtScores(currentScores);
    });
  }, []);
  const nextGameSort = Object.keys(nextGames).sort();
  const halfNext = nextGameSort.slice(0, Math.floor(nextGameSort.length / 2));
  const halfNext2 = nextGameSort.slice(-Math.floor(nextGameSort.length / 2));
  return (
    <div className="home-container">
      <div className="home-split">
        {courtScores.map(({ matches }, index) => (
          <Matches courtNo={index + 1} matches={matches} key={index} />
        ))}
      </div>
      <div className="home-right-split">
        <div className="home-leaders-container">
          <div className="home-leader-title">
            <div style={{ flex: 3, justifyContent: "left" }}>Leaders</div>
            <div style={{ flex: 1 }}>No. Wins</div>
            <div style={{ flex: 1 }}>Points</div>
          </div>
          <div className="home-leaders">
            {leaders.map(({ name, points, numWins }) => (
              <LeaderboardPlayer
                player={name}
                numWins={numWins}
                points={points}
                key={name}
              />
            ))}
          </div>
          <span>
            {!isFullscreen ? (
              <button
                className="home-screen-btn"
                onClick={() => document.body.requestFullscreen()}
              >
                <img
                  style={{ filter: "invert(1)" }}
                  width={50}
                  height={50}
                  alt="full screen"
                  src="/fullscreen.svg"
                />
              </button>
            ) : (
              <button
                className="home-screen-btn"
                onClick={() => document.exitFullscreen()}
              >
                <img
                  style={{ filter: "invert(1)" }}
                  width={50}
                  height={50}
                  alt="full screen"
                  src="/exitfullscreen.svg"
                />
              </button>
            )}
            <button
              className="home-screen-btn"
              style={{ color: "white" }}
              onClick={() =>
                setDarkMode((prev) => {
                  localStorage.setItem("darkMode", `${!prev}`);
                  return !prev;
                })
              }
            >
              {darkMode ? "LIGHT" : "DARK"}
            </button>
          </span>
        </div>
        <div style={{flex: 1, display: "flex", justifyContent: "center", alignItems: "center", borderRadius: 10, color: "black"}}>
          
        </div>
        <div className="home-next-matches">
          <div className="home-next-match">
            <div style={{ flex: 2 }}>Next Games</div>
            <div style={{ flex: 2 }}>Against</div>
            <div style={{ flex: 1, justifyContent: "center" }}>Court</div>
          </div>
          <div className="home-next-match-children">
            {halfNext.map((nextGame) => (
              <div className="nm">
                <div style={{ flex: 2 }}>{nextGame}</div>
                <div style={{ flex: 2 }}>{nextGames[nextGame].against}</div>
                <div style={{ flex: 1, justifyContent: "center" }}>
                  {nextGames[nextGame].court}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="home-next-matches">
          <div className="home-next-match">
            <div style={{ flex: 2 }}>Next Games</div>
            <div style={{ flex: 2 }}>Against</div>
            <div style={{ flex: 1, justifyContent: "center" }}>Court</div>
          </div>
          <div className="home-next-match-children">
            {halfNext2.map((nextGame) => (
              <div className="nm">
                <div style={{ flex: 2 }}>{nextGame}</div>
                <div style={{ flex: 2 }}>{nextGames[nextGame].against}</div>
                <div style={{ flex: 1, justifyContent: "center" }}>
                  {nextGames[nextGame].court}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function getLeaders(data) {
  if (Object.keys(data).length == 0) return [];
  let players = jse.reduce(
    (prev, curr) => ({ ...prev, [curr]: { numWins: 0, points: 0 } }),
    {}
  );
  data.forEach((cur) => {
    const games = cur.matches;
    games.forEach((game) => {
      const { player1, player2, scores, winner } = game[0];
      const player1N = player1.split(" ")[0];
      const player2N = player2.split(" ")[0];
      if (winner != 0) {
        winner == 1 ? players[player1N].numWins++ : players[player2N].numWins++;
        players[player1N].points += scores[0] > 21 ? 21: scores[0];
        players[player2N].points += scores[1] > 21 ? 21: scores[1];
      }
    });
  });

  const array = Object.keys(players).map((name) => ({
    ...players[name],
    name,
  }));
  const sorted_array = array.sort((a, b) =>
    a.numWins < b.numWins
      ? 1
      : a.numWins == b.numWins
      ? a.points < b.points
        ? 1
        : -1
      : -1
  );
  return sorted_array;
}

function getPlayers(data) {
  return data.reduce(
    (prev, curr) => ({
      ...prev,
      ...curr.games.reduce(
        (pgame, cgame) => ({
          ...pgame,
          [cgame.player1]: null,
          [cgame.player2]: null,
        }),
        {}
      ),
    }),
    {}
  );
}

function getNextGames(data) {
  if (Object.keys(data).length == 0) return {};
  let players = {};
  for (let i = 0; i < data[0].matches.length; i++) {
    for (let j = 0; j < data.length; j++) {
      const game = data[j].matches[i][0];
      if (game.winner == 0) {
        if (!(game.player1 in players)) {
          players[game.player1] = {
            court: j + 1,
            against: game.player2,
          };
        }
        if (!(game.player2 in players)) {
          players[game.player2] = {
            court: j + 1,
            against: game.player1,
          };
        }
      }
    }
  }
  return players;
}
