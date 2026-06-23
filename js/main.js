import { Player } from './player.js'
import { Timer } from './timer.js'

function loadSubjects() {
    let subjects = JSON.parse(localStorage.getItem("subjects")) || 
        ["Python", "C", "NetAcad", "Project", "School"]

    let select = document.getElementById("subject-select")
    // clear existing options except "add-new"
    select.innerHTML = '<option value="add-new">+ Add Subject...</option>'

    let addNewOption = select.querySelector('option[value="add-new"]')

    subjects.forEach(subject => {
        let option = document.createElement("option")
        option.value = subject
        option.textContent = subject
        select.insertBefore(option, addNewOption)
    })

    if (subjects.length > 0) {
        select.value = subjects[0]
    }

}

loadSubjects()

let hunter = new Player ("Hunter")
hunter.gainExp(150)

document.getElementById("player-name").textContent = hunter.name
document.getElementById("player-level").textContent = `Lvl ${hunter.level}`

let pomodoro = new Timer()
let intervalid = null

document.getElementById("start-btn").addEventListener("click", () => {
    if (pomodoro.isRunning) return // ignore clicking if its already running.

    clearInterval(intervalid)
    pomodoro.start()

    intervalid = setInterval(() => {
        pomodoro.tick()
        document.getElementById("timer-mode").textContent =
            pomodoro.mode === "study" ? "Study Session" :
            pomodoro.mode === "shortBreak" ? "Short Break" : "Long Break"
        document.getElementById("timer-display").textContent = pomodoro.getFormattedTime()
        document.getElementById("session-count").textContent =
            `Session completed: ${pomodoro.sessionCompleted}`
    }, 1000)
})

document.getElementById("pause-btn").addEventListener("click", () => {
    pomodoro.pause()
    clearInterval(intervalid)
})

document.getElementById("end-btn").addEventListener("click", () => {
    pomodoro.pause()
    clearInterval(intervalid)
    document.getElementById("session-modal").classList.remove("hidden") // to show modal
})

document.getElementById("subject-select").addEventListener("change", () => {
    if (document.getElementById("subject-select").value === "add-new") {
        document.getElementById("new-subject-input").classList.remove("hidden")
    } else {
        document.getElementById("new-subject-input").classList.add("hidden")
    }
})

document.getElementById("save-subject-btn").addEventListener("click", () => {
    let newSubject = document.getElementById("new-subject-name").value
    let option = document.createElement("option")
    option.value = newSubject
    option.textContent = newSubject

    let select = document.getElementById("subject-select")
    let addNewOption = select.querySelector('option[value="add-new"]')
    select.insertBefore(option, addNewOption)

    select.value = newSubject
    document.getElementById("new-subject-input").classList.add("hidden")
    document.getElementById("new-subject-name").value = "" // clear the input

    let subjects = JSON.parse(localStorage.getItem("subjects")) ||
        ["Python", "C", "NetAcad", "Project", "School"]

    // add new subjects to the array
    subjects.push(newSubject)

    // save back to localStorage
    localStorage.setItem("subjects", JSON.stringify(subjects))

})