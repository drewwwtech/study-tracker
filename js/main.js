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

function savePlayer() {
    localStorage.setItem("player", JSON.stringify({
        name: hunter.name,
        level: hunter.level,
        currentXP: hunter.currentXP,
        xpToNextLevel: hunter.xpToNextLevel,
        subjects: hunter.subjects,
        currentStreak: hunter.currentStreak,
        longestStreak: hunter.longestStreak,
        lastStudyDate: hunter.lastStudyDate,
        rewardHistory: hunter.rewardHistory
    }))
}

function loadPlayer() {
    let saved = JSON.parse(localStorage.getItem("player"))
    if(saved) {
        hunter.name = saved.name
        hunter.level = saved.level
        hunter.currentXP = saved.currentXP
        hunter.xpToNextLevel = saved.xpToNextLevel
        hunter.subjects = saved.subjects
        hunter.currentStreak = saved.currentStreak
        hunter.longestStreak = saved.longestStreak
        hunter.lastStudyDate = saved.lastStudyDate
        hunter.rewardHistory = saved.rewardHistory
    }
}

function switchView(viewName) {
    // hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden')
    })

    // show the selected view
    document.getElementById(`${viewName}-view`).classList.remove('hidden')

    //update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active')
    })
}

loadSubjects()

let hunter = new Player ("Hunter")
loadPlayer()

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

document.getElementById("submit-session").addEventListener("click", () => {
    let subject = document.getElementById("subject-select").value
    let learned = document.getElementById("journal-learned").value
    let difficulty = document.getElementById("journal-difficulty").value

    let xpEarned = 50 + (pomodoro.sessionCompleted * 10)
    hunter.gainExp(xpEarned)

    // update subject stat
    hunter.updateSubject(subject, pomodoro.sessionCompleted)

    // update streak
    hunter.updateStreak()

    // update sidebar display
    document.getElementById("player-level").textContent = `Lvl ${hunter.level}`

    //hide modal
    document.getElementById("session-modal").classList.add("hidden")

    console.log("XP earned:", xpEarned, "Player:", hunter)

    console.log(subject, learned, difficulty)

    savePlayer()
})

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault() // prevent the # jump
        let viewName = item.querySelector('a').textContent.toLowerCase()
        switchView(viewName)
        item.classList.add('active')
    })
})