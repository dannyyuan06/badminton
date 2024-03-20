export default function LeaderboardPlayer({player, numWins, points}) {
  return (
    <div>
      <div className="lb-player">{player}</div>
      <div className="lb-num-wins">{numWins}</div>
      <div className="lb-points">{points}</div>
    </div>
  )
}