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
}