import { Player } from './player.js'
import { Timer } from './timer.js'

let hunter = new Player ("Hunter")
hunter.gainExp(150)

document.getElementById("player-name").textContent = hunter.name
document.getElementById("player-level").textContent = `Lvl ${hunter.level}`

let pomodoro = new Timer()
let intervalid = null

document.getElementById("start-btn").addEventListener("click", () => {
    clearInterval(intervalid)
    pomodoro.start()

    setInterval(() => {
        pomodoro.tick()
        document.getElementById("timer-display").textContent = pomodoro.getFormattedTime()
    }, 1000)
})

document.getElementById("pause-btn").addEventListener("click", () => {
    pomodoro.pause()
    clearInterval(intervalid)
})