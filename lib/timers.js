class Timers {
  constructor() {
    this.timers = []
  }

  addGame(gameId) {
    timer = new Timer(gameId)
    this.timers[gameId] = timer
  }  

  startTimer(gameId) {
    this.timers[gameId].start()
  }

  stopTimer(gameId) {
    this.timers[gameId].stop()
  }
}

class Timer {
  constructor(gameId) {
    this.gameId = gameId
    this.interval = null
  }

  start() {
    this.interval = setInterval(this.tick, 1000)
  }

  stop() {
    clearInterval(this.interval)
  }

  tick() {
    console.log(this.gameId)
    // fetch completed envelops for each team
    // fetch current score for each team
    // calculate new score
    // save score to db
  }
}

modules.export = new Timers()
