import { Player } from './player.js'
import { Timer } from './timer.js'

let hunter = new Player ("Hunter")
hunter.gainExp(150)

document.getElementById("player-name").textContent = hunter.name
document.getElementById("player-level").textContent = `Lvl ${hunter.level}`

let pomodoro = new Timer()
console.log(pomodoro.getFormattedTime()) // test for timer