export class Timer {
    constructor() {
        this.mode = "study"
        this.timeLeft = 1500
        this.sessionCompleted = 0
        this.isRunning = false
        this.studyDuration = 1500
        this.shortBreakDuration = 300
        this.longBreakDuration = 900   
    }

    pause() {
        this.isRunning = false
    }

    start() {
        this.isRunning = true
    }

    switchMode() {
        if (this.mode == "study") {
            this.sessionCompleted += 1

            if (this.sessionCompleted % 4 === 0) {
                this.mode = "longBreak"
                this.timeLeft = this.longBreakDuration
            } else {
                this.mode = "shortBreak"
                this.timeLeft = this.shortBreakDuration
            }
        } else {
            this.mode = "study"
            this.timeLeft = this.studyDuration
        }

    }

    tick() {
        if (!this.isRunning) {
            return
        }
        this.timeLeft -= 1
        if (this.timeLeft == 0) {
            this.switchMode()
        }
        } 

    getFormattedTime() {
        let minutes = Math.floor(this.timeLeft / 60)
        let seconds = this.timeLeft % 60

        let minutesStr = minutes.toString().padStart(2, "0")
        let secondsStr = seconds.toString().padStart(2, "0")

        return `${minutesStr}:${secondsStr}`        
    }

    }