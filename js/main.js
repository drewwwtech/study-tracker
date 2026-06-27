import { Player } from './player.js'
import { Timer } from './timer.js'

const REWARDS = [
    { name: "Game Pass", type: "Gaming", rarity: "Common", duration: "30 mins" },
    { name: "Extended Game Pass", type: "Gaming", rarity: "Rare", duration: "1 hour" },
    { name: "Episode Pass", type: "Watch", rarity: "Common", duration: "1 episode" },
    { name: "Movie Pass", type: "Watch", rarity: "Rare", duration: "2 hours" },
    { name: "Snack Pass", type: "Food", rarity: "Common", duration: "Enjoy a snack" },
    { name: "Nap Pass", type: "Rest", rarity: "Common", duration: "20 mins" },
    { name: "Social Pass", type: "Social", rarity: "Rare", duration: "1 hour" },
    { name: "Legendary Game Night", type: "Gaming", rarity: "Legendary", duration: "3 hours" },
    { name: "Binge Pass", type: "Watch", rarity: "Legendary", duration: "3 episodes" },
    { name: "Free Day Pass", type: "Rest", rarity: "Legendary", duration: "Rest of the day" }
]

function rollReward() {
    let roll = Math.random() * 100
    let rarity

    if (roll < 10) {
        rarity = "Legendary"
    } else if (roll < 40) {
        rarity = "Rare"
    } else {
        rarity = "Common"
    }

    let pool = REWARDS.filter(reward => reward.rarity === rarity)

    return pool[Math.floor(Math.random() * pool.length)]
}

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

function getRank(level) {
    if (level >= 1 && level <= 15) {
        return "E"
    } else if (level >= 16 && level <= 30) {
        return "D"
    } else if (level >= 31 && level <= 55) {
        return "C"
    } else if (level >= 56 && level <= 70) {
        return "B"
    } else if (level >= 71 && level <= 85) {
        return "A"
    } else {
        return "S"
    } 
}

function updateProfileView() {
    document.getElementById("profile-name").textContent = hunter.name
    document.getElementById("profile-rank").textContent = getRank(hunter.level)
    document.getElementById("profile-level").textContent = hunter.level
    document.getElementById("xp-text").textContent = `${hunter.currentXP} / ${hunter.xpToNextLevel} XP`
    document.getElementById("profile-streak").textContent = hunter.currentStreak
    document.getElementById("profile-longest-streak").textContent = hunter.longestStreak

    // XP bar width as percentage
    let xpPercent = (hunter.currentXP / hunter.xpToNextLevel) * 100
    document.getElementById("xp-bar").style.width = `${xpPercent}%`

    // build subject stats dynamically
    let subjectList = document.getElementById("subjects-stats-list")
    subjectList.innerHTML = ""

    Object.entries(hunter.subjects).forEach(([subject, points]) => {
        subjectList.innerHTML += `
            <div class="subject-stat">
                <span>${subject}</span>
                <span>${points} pts</span>
            </div>
        `
    })
}

function showReward(reward) {
    let rarityColors = {
        "Common": "var(--primary-body-text)",
        "Rare": "var(--rewards-text-legendary-color)",
        "Legendary": "var(--vivid-warning-text-color)"
    }
    document.getElementById("reward-rarity").textContent = reward.rarity
    document.getElementById("reward-rarity").style.color = rarityColors[reward.rarity]
    document.getElementById("reward-rarity").style.border = `1px solid ${rarityColors[reward.rarity]}`
    document.getElementById("reward-name").textContent = reward.name
    document.getElementById("reward-type").textContent = reward.type
    document.getElementById("reward-duration").textContent = reward.duration
    document.getElementById("reward-modal").classList.remove("hidden")
}

loadSubjects()

let hunter = new Player ("Hunter")
loadPlayer()
updateProfileView()

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

    let reward = rollReward()
    hunter.unclaimedRewards.push(reward)
    

    savePlayer()
    updateProfileView()
    showReward(reward)
})

document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault() // prevent the # jump
        let viewName = item.querySelector('a').textContent.toLowerCase()
        switchView(viewName)
        item.classList.add('active')
    })
})

document.getElementById("claim-reward-btn").addEventListener("click", () => {
    document.getElementById("reward-modal").classList.add("hidden")

    // reset timer for next session
    pomodoro.pause()
    clearInterval(intervalid)
    pomodoro.mode = "study"
    pomodoro.timeLeft = pomodoro.studyDuration
    pomodoro.sessionCompleted = 0

    document.getElementById("timer-display").textContent = pomodoro.getFormattedTime()
    document.getElementById("timer-mode").textContent = "Study Session"
    document.getElementById("session-count").textContent = "Session complete: 0"

})