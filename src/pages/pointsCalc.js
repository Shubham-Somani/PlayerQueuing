/**
 * Returns the ranks and points assigned to the player based on their bids placed
 *
 * @param {Object} data Information about the game and players.
 * @param {String} data.gameType Type of Game played by the users
 * @param {Array} [data.players] Array of objects of players
 * @returns {Array} Array of players with their score and ranks
**/
const calculatePoints = (data) => {
  try {
    const { players } = data
    let activePlayer = 0

    /**
     * Sort the players based on their bid
    **/
    players.sort(function (a, b) {
      return b.bid - a.bid
    })

    /**
     * Now assign each players a rank based on their score
     * and based on their rank we will assign a score
    **/
    let rank = 1
    const rankCount = {}
    for (let i = 0; i < players.length; i++) {
      // increase rank only if current bid less than previous
      if (i > 0 && parseInt(players[i].bid) < parseInt(players[i - 1].bid)) {
        rank++
      }
      if (players[i].bid !== null) {
        activePlayer++
      }
      rankCount[rank] = rankCount[rank] ? rankCount[rank] + 1 : 1
      players[i].rank = rank
    }

    /**
     * Get The scoring system values
     * Type: Array
    **/
    return getScoringValues(players, activePlayer, rankCount)
  } catch (error) {
    console.log('error --->', error)
  }
}
/**
 * Returns the score of the player based on their ranks
 *
 * @param {Array} players Array of objects of players
 * @param {Number} activePlayer Number of active players in the game
 * @param {Object} rankCount Contains the information about rank repetition
 * @returns {Array} Array of players with their score and ranks
**/
const getScoringValues = (players, activePlayer, rankCount) => {
  const highestScore = 12
  const lowestScore = highestScore / activePlayer
  const scoreSystem = [highestScore]
  for (let i = 1; i < players.length; i++) {
    scoreSystem.push(
      scoreSystem[i - 1] - lowestScore < 0
        ? 0
        : scoreSystem[i - 1] - lowestScore
    )
  }

  for (let i = 0; i < players.length; i++) {
    const rankRepeat = rankCount[players[i].rank]
    if (rankRepeat === 1) {
      players[i].score = scoreSystem[i]
    } else {
      players[i].score =
        sumBetweenTwoIndex(
          scoreSystem,
          players[i].rank - 1,
          ((players[i].rank - 1) >= (rankRepeat - 1)) ? (((players[i].rank - 1) === (rankRepeat - 1)) ? rankRepeat : rankRepeat + 1) : (rankRepeat - 1)
        ) / rankRepeat
    }
  }
  return players
}

// rankRepeat - 1 === players[i].rank - 1 ? rankRepeat : rankRepeat - 1
// 2 - 1 === 2 ? 2 : 1
/**
 * Returns the sum of the integers whose index is between i1 and i2.
 *
 * @param array
 * @param i1
 * @param i2
 * @returns {Int} result
**/
const sumBetweenTwoIndex = (array, i1, i2) => {
  let result = 0
  array.slice(i1, i2 + 1).forEach((element) => {
    result += element
  })
  return result
}

const players = [
  {
    bid: 102
  },
  {
    bid: 112
  },
  {
    bid: 112
  },
  {
    bid: null
  }
]

console.log(
  calculatePoints({
    gameType: '4Player',
    players: players
  })
)
