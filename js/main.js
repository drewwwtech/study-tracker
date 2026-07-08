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

const BADGES =[ 
    {
        id: "first-session",
        name: "First Step",
        icon: "fa-solid fa-fire",
        description: "Complete your first study session",
        condition: (player, sessions) => sessions >= 1,
        earned: false
    },
    {
        id: "week-warrior",
        name: "Week Warrior",
        icon: "fa-solid fa-calendar-check",
        description: "Reach a 7 day streak",
        condition: (player, sessions) => player.currentStreak >= 7,
        earned: false
    },
    {
        id: "level-five",
        name: "Rising Hunter",
        icon: "fa-solid fa-bolt",
        description: "Reach Level 5",
        condition: (player, sessions) => player.level >= 5,
        earned: false
    },
    {
        id: "ten-sessions",
        name: "Dedicated",
        icon: "fa-solid fa-award",
        description: "Complete 10 total sessions",
        condition: (player, sessions) => sessions >= 10,
        earned: false
    }
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
        rewardHistory: hunter.rewardHistory,
        unclaimedRewards: hunter.unclaimedRewards,
        totalSessions: hunter.totalSessions
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
        hunter.unclaimedRewards = saved.unclaimedRewards
        hunter.totalSessions = saved.totalSessions || 0
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

function updateRewardsView() {
    let unclaimedList = document.getElementById("unclaimed-list")
    let historyList = document.getElementById("history-list")

    // build unclaimed rewards
    unclaimedList.innerHTML = ""
    if (hunter.unclaimedRewards.length === 0) {
        unclaimedList.innerHTML = "<p class='empty-msg'>No unclaimed rewards. Complete a session to earn one!</p>"
    } else {
        hunter.unclaimedRewards.forEach((reward, index) => {
            unclaimedList.innerHTML += `
                <div class="reward-card">
                    <div class="reward-card-info">
                        <span class="reward-card-name">${reward.name}</span>
                        <span class="reward-card-meta">${reward.rarity} • ${reward.duration}</span>
                    </div>
                    <button class="use-reward-btn" data-index="${index}">Use</button>
                </div>
            `
        })
    }

    // build reward history
    historyList.innerHTML = ""
    if (hunter.rewardHistory.length === 0) {
        historyList.innerHTML = "<p class='empty-msg'>No rewards used yet.</p>"
    } else {
        hunter.rewardHistory.forEach(reward => {
            historyList.innerHTML += `
                <div class="history-item">
                    <span>${reward.name}</span>
                    <span class="history-date">${reward.usedDate}</span>
                </div>
            `
        })
    }

    // wireup Use buttons
    document.querySelectorAll(".use-reward-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let index = parseInt(e.target.dataset.index)
            let reward = hunter.unclaimedRewards[index]

            // move to history with date
            reward.usedDate = new Date().toISOString().split('T')[0]
            hunter.rewardHistory.push(reward)
            hunter.unclaimedRewards.splice(index, 1)

            savePlayer()
            updateRewardsView()
        })
    })
}

function loadNotes() {
    let notes = JSON.parse(localStorage.getItem("notes")) || []
    let notesList = document.getElementById("notes-list")
    notesList.innerHTML = ""

    if (notes.length === 0) {
        notesList.innerHTML = "<p class='empty-msg'>No notes yet. Write something!</p>"
        return
    }

    notes.forEach((note, index) => {
        notesList.innerHTML += `
            <div class="note-card">
                <div class="note-contents">${note.text}</div>
                <div class="note-footer">
                    <span class="note-date">${note.date}</span>
                    <button class="delete-note-btn" data-index="${index}">Delete</button>
                </div>
            </div>
        `
    })

    document.querySelectorAll(".delete-note-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            let index = parseInt(e.target.dataset.index)
            notes.splice(index, 1)
            localStorage.setItem("notes", JSON.stringify(notes))
            loadNotes()
        })
    })

}

function checkBadges(totalSessions) {
    let earnedBadges = JSON.parse(localStorage.getItem("earnedBadges")) || []

    BADGES.forEach(badge => {
        if (!earnedBadges.includes(badge.id) && badge.condition(hunter, totalSessions)) {
            earnedBadges.push(badge.id)
            badge.earned = true
        } else if (earnedBadges.includes(badge.id)) {
            badge.earned = true
        }
    })

    localStorage.setItem("earnedBadges", JSON.stringify(earnedBadges))
    updateBadgesView()
}

function updateBadgesView() {
    let earnedBadges = JSON.parse(localStorage.getItem("earnedBadges")) || []
    let badgesList = document.getElementById("badges-list")
    if (!badgesList) return

    badgesList.innerHTML = ""

    BADGES.forEach(badge => {
        let isEarned = earnedBadges.includes(badge.id)
        badgesList.innerHTML += `
            <div class="badge-card ${isEarned ? 'earned' : 'locked'}">
                <i class="${badge.icon} badge-icon"></i>
                <div class="badge-info">
                    <span class="badge-name">${badge.name}</span>
                    <span class="badge-desc">${badge.description}</span>
                </div>
                ${isEarned ? '<span class="badge-status">✓ Earned</span>' : '<span class="badge-status locked-text">Locked</span>'}
            </div>
        `
    })
}

function updateReportsView() {
    document.getElementById("report-sessions").textContent = hunter.totalSessions
    document.getElementById("report-level").textContent = hunter.level
    document.getElementById("report-xp").textContent = hunter.currentXP
    document.getElementById("report-streak").textContent = `${hunter.currentStreak} days`
    document.getElementById("report-longest").textContent = `${hunter.longestStreak} days`

    // subjects
    let reportSubjects = document.getElementById("report-subjects")
    reportSubjects.innerHTML = ""
    Object.entries(hunter.subjects).forEach(([subject, points]) => {
        reportSubjects.innerHTML += `
            <div class="report-item">
                <span>${subject}</span>
                <span>${points} pts</span>
            </div>
        `
    })

    // rewards summary
    let earnedBadges = JSON.parse(localStorage.getItem("earnedBadges")) || []
    document.getElementById("report-rewards-earned").textContent = 
        hunter.unclaimedRewards.length + hunter.rewardHistory.length
    document.getElementById("report-rewards-used").textContent = 
        hunter.rewardHistory.length
    document.getElementById("report-badges").textContent = earnedBadges.length
}

loadSubjects()

let hunter = new Player ("Hunter")
loadPlayer()
updateProfileView()
updateRewardsView()
loadNotes()
updateBadgesView()
updateReportsView()

document.getElementById("player-name").textContent = hunter.name
document.getElementById("player-level").textContent = `Lvl ${hunter.level}`


let pomodoro = new Timer()
let intervalid = null

document.getElementById("start-btn").addEventListener("click", () => {
    if (pomodoro.isRunning) return

    clearInterval(intervalid)
    pomodoro.start()

    let startTime = Date.now()
    let initialTimeLeft = pomodoro.timeLeft  // capture real starting time

    if (pomodoro.mode === "study") {
        document.getElementById("tick-sound").play()
    }

    intervalid = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000)
        pomodoro.timeLeft = initialTimeLeft - elapsed

        if (pomodoro.timeLeft <= 0) {
            pomodoro.timeLeft = 0
            pomodoro.isRunning = false
        }

        if (pomodoro.timeLeft === 0 && !pomodoro.isRunning) {
            clearInterval(intervalid)
            document.getElementById("tick-sound").pause()
            document.getElementById("tick-sound").currentTime = 0
            document.getElementById("chime-sound").play()
            document.getElementById("continue-btn").classList.remove("hidden")
        }

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
    document.getElementById("tick-sound").pause()
})

document.getElementById("end-btn").addEventListener("click", () => {
    pomodoro.pause()
    clearInterval(intervalid)
    document.getElementById("tick-sound").pause()
    document.getElementById("session-modal").classList.remove("hidden")
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

    hunter.totalSessions += 1
    checkBadges(hunter.totalSessions)

    // update sidebar display
    document.getElementById("player-level").textContent = `Lvl ${hunter.level}`

    //hide modal
    document.getElementById("session-modal").classList.add("hidden")

    let reward = rollReward()
    hunter.unclaimedRewards.push(reward)
    

    savePlayer()
    updateProfileView()
    showReward(reward)
    updateRewardsView()
    updateReportsView()

    document.getElementById("journal-learned").value = ""
    document.getElementById("journal-difficulty").value = ""
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
    document.getElementById("tick-sound").pause()
    document.getElementById("tick-sound").currentTime = 0

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

document.getElementById("save-note-btn").addEventListener("click", () => {
    let text = document.getElementById("note-input").value.trim()
    if (!text) return // don't save empty notes

    let notes = JSON.parse(localStorage.getItem("notes")) || []
    notes.unshift({ // unshifts adds to beginning, so newest notes appear first
        text: text,
        date: new Date().toISOString().split('T')[0]
    })

    localStorage.setItem("notes", JSON.stringify(notes))
    document.getElementById("note-input").value = ""
    loadNotes()
})

document.getElementById("save-name-btn").addEventListener("click", () => {
    let newName = document.getElementById("name-input").value.trim()
    if (!newName) return

    hunter.name = newName
    savePlayer()
    document.getElementById("player-name").textContent = hunter.name
    updateProfileView()
    document.getElementById("name-input").value = ""
})

document.getElementById("reset-btn").addEventListener("click", () => {
    if (confirm("Are you sure? This will delete ALL your progress!")) {
        localStorage.clear()
        location.reload()
    }
})

document.getElementById("continue-btn").addEventListener("click", () => {
    pomodoro.switchMode()
    document.getElementById("continue-btn").classList.add("hidden")
    
    pomodoro.start()

    let startTime = Date.now()
    let initialTimeLeft = pomodoro.timeLeft  // capture after switchMode sets new duration
    
    if (pomodoro.mode === "study") {
        document.getElementById("tick-sound").play()
    }
    
    intervalid = setInterval(() => {
        let elapsed = Math.floor((Date.now() - startTime) / 1000)
        pomodoro.timeLeft = initialTimeLeft - elapsed

        if (pomodoro.timeLeft <= 0) {
            pomodoro.timeLeft = 0
            pomodoro.isRunning = false
        }

        if (pomodoro.timeLeft === 0 && !pomodoro.isRunning) {
            clearInterval(intervalid)
            document.getElementById("tick-sound").pause()
            document.getElementById("tick-sound").currentTime = 0
            document.getElementById("chime-sound").play()
            document.getElementById("continue-btn").classList.remove("hidden")
        }
        
        document.getElementById("timer-mode").textContent =
            pomodoro.mode === "study" ? "Study Session" :
            pomodoro.mode === "shortBreak" ? "Short Break" : "Long Break"
        document.getElementById("timer-display").textContent = pomodoro.getFormattedTime()
        document.getElementById("session-count").textContent =
            `Session completed: ${pomodoro.sessionCompleted}`
    }, 1000)
})