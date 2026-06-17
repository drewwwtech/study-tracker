import { Player } from './player.js'

let hunter = new Player ("Hunter")
hunter.gainExp(150)

document.getElementById("player-name").textContent = hunter.name
document.getElementById("player-level").textContent = `Lvl ${hunter.level}`