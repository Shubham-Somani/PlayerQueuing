<template>
  <q-page>
    <q-header elevated>
      <q-toolbar>
        Calculate Score
      </q-toolbar>
    </q-header>
    <div class="wrapper full-width row wrap justify-start items-start content-start">
      <div class="queue-wrap col-12">
        <div class="row overflow-auto">
          <div border class="full-width">
            <div class="row full-width">
              <div class="q-pa-md col-12 text-center border-right">
                <div class="col-12  border-bottom">
                  <q-select
                    outlined
                    dense
                    @update:model-value="onSelectGameType"
                    v-model="model"
                    :options="options"
                    label="Select Game Type"
                  />
                </div>
              </div>
              <div class="col-12">
                <div class="row full-width" v-for="player in gamePlayers" :key="player.name" >
                  <div class="q-pa-md row text-center border-right">
                    <q-input
                      class="display-inline col-12"
                      dense
                      outlined
                      v-model="player.bid"
                      :label="player.name"
                    />
                    <p class="col-12 text-left no-margin q-py-xs" > <span class="text-bold"> Rank - </span> {{ player.rank }}</p>
                    <br/>
                    <p class="col-12 text-left no-margin q-py-xs"> <span class="text-bold"> Score - </span> {{ player.score }}</p>
                  </div>
                </div>
                <div class=" q-pa-md">
                  <q-btn @click="submitBid" color="primary" label="Submit" />
                </div>
              </div>

              <!-- <div class="col-3 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Three Player Queue</p>
                <div v-for="threePlayer in threePlayerQueue" :key="threePlayer.name" class="col-12  border-bottom">
                  {{ threePlayer.name }}
                </div>
              </div>
              <div class="col-3 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Four Player Queue</p>
                <div v-for="fourPlayer in fourPlayerQueue" :key="fourPlayer.name" class="col-12  border-bottom">
                  {{ fourPlayer.name }}
                </div>
              </div>
              <div class="col-3 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Any Player Queue</p>
                <div v-for="(anyPlayer, index) in anyPlayerQueue" :key="anyPlayer.name" class="col-12  border-bottom">
                  <p class="no-margin"> {{ anyPlayer.name }} </p>
                  <p class="no-margin"> Seconds: {{ anyPlayer.seconds }} {{ this.getTimeDifference(anyPlayer.time, index, 'anyPlayerQueue') }} </p>
                </div>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="wrapper full-width row wrap justify-start items-start content-start">
      <div class="game-button-wrap col-12">
        <div class="game-wrap">
          <div border class="full-width">
            <div class="full-width text-center">Games 🏆</div>
            <div class="row full-width">
              <div class="col-4 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Two Player Game</p>
                <div v-for="twoPlayer in twoPlayerGame" :key="twoPlayer.name" class="col-12  border-bottom">
                  {{ twoPlayer.playerOne.name }} - {{ twoPlayer.playerTwo.name }}
                </div>
              </div>
              <div class="col-4 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Three Player Game</p>
                <div v-for="threePlayer in threePlayerGame" :key="threePlayer.name" class="col-12  border-bottom">
                  {{ threePlayer.playerOne.name }} - {{ threePlayer.playerTwo.name }} - {{ threePlayer.playerThree.name }}
                </div>
              </div>
              <div class="col-4 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Four Player Game</p>
                <div v-for="fourPlayer in fourPlayerGame" :key="fourPlayer.name" class="col-12  border-bottom">
                  {{ fourPlayer.playerOne.name }} - {{ fourPlayer.playerTwo.name }} - {{ fourPlayer.playerThree.name }} - {{ fourPlayer.playerFour.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
  </q-page>
</template>
<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  data () {
    return {
      model: null,
      options: [
        { label: '2 Player', value: 2 },
        { label: '3 Player', value: 3 },
        { label: '4 Player', value: 4 }
      ],
      playersArray: [
        { name: 'Enter Shubham\'s Bid', bid: null, score: 0, rank: null },
        { name: 'Enter Ankit\'s Bid', bid: null, score: 0, rank: null },
        { name: 'Enter Rahul\'s Bid', bid: null, score: 0, rank: null },
        { name: 'Enter Shenbaga\'s Bid', bid: null, score: 0, rank: null }
      ],
      gamePlayers: []
    }
  },
  methods: {
    onSelectGameType (gameType) {
      this.gamePlayers = []
      console.log('this.gamePlayers- -->', this.gamePlayers)
      this.gamePlayers = JSON.parse(JSON.stringify(this.playersArray.slice(0, gameType.value)))
    },
    async submitBid () {
      console.log('this.gamePlayers- -->', this.gamePlayers)
      await this.calculatePoints({ players: this.gamePlayers })
      console.log('done -->', this.gamePlayers)
    },
    /**
     * Returns the ranks and points assigned to the player based on their bids placed
     *
     * @param {Object} data Information about the game and players.
     * @param {String} data.gameType Type of Game played by the users
     * @param {Array} [data.players] Array of objects of players
     * @returns {Array} Array of players with their score and ranks
    **/
    calculatePoints (data) {
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
          if (i > 0 && players[i].bid < players[i - 1].bid) {
            rank++
          }
          console.log(`players[${i}].bid -->`, players[i].bid !== null)
          console.log(`players[${i}].bid -->`, players[i].bid !== '')
          if (players[i].bid !== null && players[i].bid !== '') {
            activePlayer++
          }
          rankCount[rank] = rankCount[rank] ? rankCount[rank] + 1 : 1
          players[i].rank = rank
        }

        /**
         * Get The scoring system values
         * Type: Array
        **/
        return this.getScoringValues(players, activePlayer, rankCount)
      } catch (error) {
        console.log('error --->', error)
      }
    },
    /**
     * Returns the score of the player based on their ranks
     *
     * @param {Array} players Array of objects of players
     * @param {Number} activePlayer Number of active players in the game
     * @param {Object} rankCount Contains the information about rank repetition
     * @returns {Array} Array of players with their score and ranks
    **/
    getScoringValues (players, activePlayer, rankCount) {
      const highestScore = activePlayer <= 0 ? 0 : 12
      console.log('activePlayer -->', activePlayer)
      const lowestScore = activePlayer <= 0 ? 0 : highestScore / activePlayer
      const scoreSystem = [highestScore]
      for (let i = 1; i < players.length; i++) {
        scoreSystem.push(scoreSystem[i - 1] - lowestScore < 0 ? 0 : scoreSystem[i - 1] - lowestScore
        )
      }

      for (let i = 0; i < players.length; i++) {
        const rankRepeat = rankCount[players[i].rank]
        if (rankRepeat === 1) {
          players[i].score = scoreSystem[i]
        } else {
          players[i].score =
            this.sumBetweenTwoIndex(
              scoreSystem,
              players[i].rank - 1,
              ((players[i].rank - 1) >= (rankRepeat - 1)) ? (((players[i].rank - 1) === (rankRepeat - 1)) ? rankRepeat : rankRepeat + 1) : (rankRepeat - 1)
            ) / rankRepeat
        }
      }
      return players
    },
    /**
     * Returns the sum of the integers whose index is between i1 and i2.
     *
     * @param array
     * @param i1
     * @param i2
     * @returns {Int} result
    **/
    sumBetweenTwoIndex (array, i1, i2) {
      let result = 0
      array.slice(i1, i2 + 1).forEach((element) => {
        result += element
      })
      return result
    }
  }
})
</script>
