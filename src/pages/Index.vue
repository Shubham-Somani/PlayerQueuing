<template>
  <q-page>
    <q-header elevated>
      <q-toolbar>
        <div class="button-wrap full-width">
          <q-btn-group push spread>
            <q-btn @click="addTwoPlayerMember" color="green" push label="Two Player" />
            <q-btn @click="addThreePlayerMember" color="orange" push label="Three Player" />
            <q-btn @click="addFourPlayerMember" color="red" push label="Four Player" />
            <q-btn @click="addAnyPlayerMember" color="blue" push label="Any Player" />
          </q-btn-group>
        </div>
      </q-toolbar>
    </q-header>
    <div class="wrapper full-width row wrap justify-start items-start content-start">
      <div class="queue-wrap col-12">
        <div class="row overflow-auto">
          <div border class="full-width">
            <div class="full-width text-center">Match Making ❤️</div>
            <div class="row full-width">
              <div class="col-3 text-center border-right">
                <p class="text-bold border-bottom border-top no-margin">Two Player Queue</p>
                <div v-for="twoPlayer in twoPlayerQueue" :key="twoPlayer.name" class="col-12  border-bottom">
                  {{ twoPlayer.name }}
                </div>
              </div>
              <div class="col-3 text-center border-right">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="wrapper full-width row wrap justify-start items-start content-start">
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
    </div>
  </q-page>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PageIndex',
  data () {
    return {
      count: new Array(8),
      twoPlayerQueue: [],
      threePlayerQueue: [],
      fourPlayerQueue: [],
      anyPlayerQueue: [],
      twoPlayerGame: [],
      threePlayerGame: [],
      fourPlayerGame: [],
      anyPlayerGame: []
    }
  },
  methods: {
    getTimeDifference (startDate, index, type) {
      const myInterval = setInterval(() => {
        const endDate = new Date()
        if (this[type][index]) {
          this[type][index].seconds = parseInt((endDate.getTime() - startDate.getTime()) / 1000)
        } else {
          clearInterval(myInterval)
        }
      }, 1000)
    },
    addData (type, numb) {
      const data = {
        name: this.getRandomString(3),
        position: this[type].length ? this[type].length : 0,
        type: type,
        seconds: 0,
        id: `${this[type].length ? this[type].length : 0}${numb}`
      }
      console.log('numb -->', numb)
      if (numb === 'any') {
        data.time = new Date()
        const timeout = setTimeout(() => {
          this.filterAnyPlayerGame()
        }, 15000)
        data.timeout = timeout
      }
      console.log(`name -> ${data.name} -- Time Out -> ${data.timeout}`)
      this[type].push(data)
      return data
    },
    /*
    *** Two Player Game Logic ***
    */
    addTwoPlayerMember () {
      // Add Player to queue
      this.addData('twoPlayerQueue', 2)
      // If two player queue has 2 players in it
      if (this.twoPlayerQueue.length >= 2) {
        const playerOne = this.twoPlayerQueue.shift()
        const playerTwo = this.twoPlayerQueue.shift()
        // Make a two player game
        this.makeTwoPlayerGame(playerOne, playerTwo)
      } else if (this.twoPlayerQueue.length === 1 && this.anyPlayerQueue.length > 0) { // IF two player queue has 1 player and any player queue has 1 player
        const playerOne = this.twoPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        // Make a two player game
        this.makeTwoPlayerGame(playerOne, playerTwo)
      }
    },
    makeTwoPlayerGame (playerOne, playerTwo) {
      this.twoPlayerGame.push({
        playerOne,
        playerTwo
      })
    },
    /*
    *** Three Player Game Logic ***
    */
    addThreePlayerMember () {
      this.addData('threePlayerQueue', 3)
      // If three player queue has 3 players in it
      if (this.threePlayerQueue.length >= 3) {
        const playerOne = this.threePlayerQueue.shift()
        const playerTwo = this.threePlayerQueue.shift()
        const playerThree = this.threePlayerQueue.shift()
        // Make a three player game
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      } else if (this.threePlayerQueue.length === 2 && this.anyPlayerQueue.length > 0) { // IF three player queue has 2 player and any player queue has 1 player
        const playerOne = this.threePlayerQueue.shift()
        const playerTwo = this.threePlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        clearTimeout(playerThree.timeout)
        // Make a three player game
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      } else if (this.threePlayerQueue.length === 1 && this.anyPlayerQueue.length >= 2) { // IF three player queue has 1 player and any player queue has 2 player
        const playerOne = this.threePlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        clearTimeout(playerThree.timeout)
        // Make a three player game
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      }
    },
    makeThreePlayerGame (playerOne, playerTwo, playerThree) {
      this.threePlayerGame.push({
        playerOne,
        playerTwo,
        playerThree
      })
    },
    /*
    *** Four Player Game Logic ***
    */
    addFourPlayerMember () {
      this.addData('fourPlayerQueue', 4)
      // If four player queue has 4 players in it
      if (this.fourPlayerQueue.length >= 4) {
        const playerOne = this.fourPlayerQueue.shift()
        const playerTwo = this.fourPlayerQueue.shift()
        const playerThree = this.fourPlayerQueue.shift()
        const playerFour = this.fourPlayerQueue.shift()
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.fourPlayerQueue.length === 3 && this.anyPlayerQueue.length > 0) { // IF four player queue has 3 player and any player queue has 1 player
        const playerOne = this.fourPlayerQueue.shift()
        const playerTwo = this.fourPlayerQueue.shift()
        const playerThree = this.fourPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerFour.timeout)
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.fourPlayerQueue.length === 2 && this.anyPlayerQueue.length >= 2) { // IF four player queue has 2 player and any player queue has 2 player
        const playerOne = this.fourPlayerQueue.shift()
        const playerTwo = this.fourPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerThree.timeout)
        clearTimeout(playerFour.timeout)
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.fourPlayerQueue.length === 1 && this.anyPlayerQueue.length >= 3) { // IF four player queue has 2 player and any player queue has 3 player
        const playerOne = this.fourPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        clearTimeout(playerThree.timeout)
        clearTimeout(playerFour.timeout)
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      }
    },
    makeFourPlayerGame (playerOne, playerTwo, playerThree, playerFour) {
      this.fourPlayerGame.push({
        playerOne,
        playerTwo,
        playerThree,
        playerFour
      })
    },
    /*
    *** Any Player Game Logic ***
    */
    addAnyPlayerMember () {
      this.addData('anyPlayerQueue', 'any')
      // If any player queue has 4 players in it
      if (this.anyPlayerQueue.length >= 4) {
        const playerOne = this.anyPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        clearTimeout(playerTwo.timeout)
        clearTimeout(playerThree.timeout)
        clearTimeout(playerFour.timeout)
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.anyPlayerQueue.length === 3 && this.fourPlayerQueue.length === 1) { // IF any player queue has 3 player and four player queue has 1 player
        const playerOne = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        const playerTwo = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        const playerThree = this.anyPlayerQueue.shift()
        clearTimeout(playerThree.timeout)
        const playerFour = this.fourPlayerQueue.shift()
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.anyPlayerQueue.length === 2 && this.fourPlayerQueue.length === 2) { // IF any player queue has 3 player and four player queue has 2 player
        const playerOne = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        const playerTwo = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        const playerThree = this.fourPlayerQueue.shift()
        const playerFour = this.fourPlayerQueue.shift()
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.anyPlayerQueue.length === 2 && this.threePlayerQueue.length === 1) { // IF any player queue has 2 player and three player queue has 1 player
        const playerOne = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        const playerTwo = this.anyPlayerQueue.shift()
        clearTimeout(playerTwo.timeout)
        const playerThree = this.threePlayerQueue.shift()
        // Make a three player game
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      } else if (this.anyPlayerQueue.length === 1 && this.fourPlayerQueue.length === 3) { // IF any player queue has 1 player and four player queue has 3 player
        const playerOne = this.fourPlayerQueue.shift()
        const playerTwo = this.fourPlayerQueue.shift()
        const playerThree = this.fourPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerFour.timeout)
        // Make a four player game
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      } else if (this.anyPlayerQueue.length === 1 && this.threePlayerQueue.length === 2) { // IF any player queue has 1 player and three player queue has 2 player
        const playerOne = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        const playerTwo = this.threePlayerQueue.shift()
        const playerThree = this.threePlayerQueue.shift()
        // Make a three player game
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      } else if (this.anyPlayerQueue.length === 1 && this.twoPlayerQueue.length === 1) { // IF any player queue has 1 player and two player queue has 1 player
        const playerOne = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        const playerTwo = this.twoPlayerQueue.shift()
        // Make a two player game
        this.makeTwoPlayerGame(playerOne, playerTwo)
      }
    },
    filterAnyPlayerGame () {
      console.log('this.anyPlayerQueue.length --->', this.anyPlayerQueue.length)
      switch (this.anyPlayerQueue.length) {
        case 1:
          {
            const playerOne = this.anyPlayerQueue.shift()
            clearTimeout(playerOne.timeout)
          }
          console.log('no game found')
          break
        case 2:
          // Make a two player game
          this.makeAnyPlayerGame(2)
          break
        case 3:
          // Make a three player game
          this.makeAnyPlayerGame(3)
          break
        case 4:
          // Make a four player game
          this.makeAnyPlayerGame(4)
          break
        default:
          {
            const playerOne = this.anyPlayerQueue.shift()
            clearTimeout(playerOne.timeout)
          }
          console.log('no game found')
      }
    },
    makeAnyPlayerGame (count) {
      console.log('count --->', count)
      if (count === 2) {
        const playerOne = this.anyPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        clearTimeout(playerTwo.timeout)
        this.makeTwoPlayerGame(playerOne, playerTwo)
      } else if (count === 3) {
        const playerOne = this.anyPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        clearTimeout(playerTwo.timeout)
        clearTimeout(playerThree.timeout)
        this.makeThreePlayerGame(playerOne, playerTwo, playerThree)
      } else if (count === 3) {
        const playerOne = this.anyPlayerQueue.shift()
        const playerTwo = this.anyPlayerQueue.shift()
        const playerThree = this.anyPlayerQueue.shift()
        const playerFour = this.anyPlayerQueue.shift()
        clearTimeout(playerOne.timeout)
        clearTimeout(playerTwo.timeout)
        clearTimeout(playerThree.timeout)
        clearTimeout(playerFour.timeout)
        this.makeFourPlayerGame(playerOne, playerTwo, playerThree, playerFour)
      }
    },
    getRandomString (length) {
      const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      let result = ''
      for (let i = 0; i < length; i++) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length))
      }
      return result
    }
  }
})
</script>

<style lang="sass" scoped>
.wrapper
  min-height: 50vH
  max-height: 50vH
.queue-wrap
  background: #ee7e7e24
.game-wrap
  background: #1cc15f47
.queue-table
  padding: 10px
  border: 1px solid #333
.border-right
  border-right: 1px solid #333
.border-bottom
  border-bottom: 1px solid #333
.border-top
  border-top: 1px solid #333
</style>
