import pandas as pd
import json
df = pd.read_csv("client/src/matches/matches.csv")
data = list(map(list, df.values))
data = list(filter(lambda x: x[0] != "Doubles" and str(x[0]) != "nan", data))
print(data)
courts = [{"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}] #, {"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}, {"games": [],"currentGame": 0, "switch": False}]
for i in range(len(data)//2):
  index = i * 2
  next_index = index + 1
  for j in range(len(data[0])):
    for _ in range(3):
      courts[j]["games"].append({
      "player1": data[index][j],
      "player2": data[next_index][j],
      "scores": [0, 0],
      "server": 0,
      "winner": 0 # 0 is not determined, 1 is player1 and 2 is player2
    })
with open("client/src/matches/matches.json", "w") as f:
  json.dump({
    "courts": courts,
    "info": "info"
    }, f)
  