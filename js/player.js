export class Player {
    constructor(name) {
        this.name = name
        this.level = 1
        this.currentXP = 0
        this.xpToNextLevel = 100
        this.subjects = {Python : 0, C : 0, NetAcad : 0, Projects : 0}
        this.currentStreak = 0
        this.longestStreak = 0
        this.lastStudyDate = null
        this.unclaimedRewards = []
        this.rewardHistory = []
    }

    updateSubject(subjectName, amount) {
        this.subjects[subjectName] += amount
    }

    gainExp(amount) {
        this.currentXP += amount
        while (this.currentXP >= this.xpToNextLevel) {
            this.levelUp()
        }
    }

    levelUp(){
        this.currentXP -= this.xpToNextLevel
        this.level += 1
        this.xpToNextLevel = (100 * this.level)
    }

}