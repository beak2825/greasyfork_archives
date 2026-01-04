// ==UserScript==
// @name            Dreamman
// @namespace       http://tampermonkey.net/
// @version         4.0.8
// @description     A user script for The West, optimized Dobby2 for butt plugs and cake decorations.
// @author          Chvostnatý Gábor
// @include         https://sk*.the-west.*/game.php*
// @include         https://cz*.the-west.*/game.php*
// @include         https://en*.the-west.*/game.php*
// @exclude         https://*.events.the-west.*
// @icon            data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAHdElNRQfoAxoTDAWMeFjOAAAGUElEQVRIxz2VW4+kVRWGn7X3/g517qo+VQ8zzAAOREiI8RDBBH+biZf+A+9M9MILYzQxkUQuMByCkijoOI4y9NDQTXdPdXdVfVVffYe99/KiBv/AerPe9b7rkRfu3tdhx/Lj1ya8+eqY/X6PTA2jJMUg1Oo5v5qz2FQsNg2Xs4qzpxXRCv88KzktAusWBHBGaFVpo4IqAVAUNys9ibNs6oBBaG6uWS8DL//oLcbT56mX1xx0TpmtZjz+6pxZvWYnMTy5alkUSvSCRiUCXiNeBQVQUCAiuDZEah+wRrBRqYqSapXSufMqMhiR5xMOkgmj5TlJJWy+LCicods3pC08vGm41MhGlVYVHyMiBguoPNswKjRR6eeORCKr0jMaH5EPB5A4NBkijSeZXXB7d4oeLVmv1iwaTy4Fy01g4SO1gsOQoLQKGIOwtc2oQusj/Y5DQmS1iQz6Q2w9h6oAVWJZ0M7nSNFwND3gcG9E7uBwnLPXTeg7YZJZjvqOQWowgOp2CyMGJwLD3HEwyjAI1zct1llUDNqsEZehRHxV0W5Kes9PqULNBGXm5/Sd8MokQxNhHmDlK2i2NxJVrAgmscK3b/e599wYa6CbWaxE/HJOWK3Be8QKdtgndizNakF3uMNksoeJhiZEJiPH2kdmqwZnBBFQVQSIGnHj3PLCfodEAjEq+6OEpqlYX55RVy0DUtJNge1kmFVKtfJ0ex1CiDS+Ybyb8WXZcLxoWTaRELdWAYgIUcHdHqRkbcvJFzNe3O+yN84JVSDvTKgXpzx69x0Sb5gOhyRGWM8LNqsNT66uedx6jtcND843VLUSVIkKIAiCE6Eh4kaZoa0Dq3UgOTK4xBCDYtMeebCY0T6PHjxg8eUpL790l2Vd8psPTvjgasNF1RKco8XQELbFQDAoURQRg6hgpgPLuvRUtWKTjF7e497tKaIRMxrxJBtxnXSwISAx0ric3z2+5v3zFYkxTLsJh5kFVbwqBjCybWPQSFDFhTZyVnhuTQPXi4pxExkcHSJZh8QHvr+TsTzcpakaksGY3FU4A04EX3lupZaTOiAImYEIWIGgEFW3tp0VnunRgP5Ozr+/WjJNUl7qjpDhGNudsVetGR1OMHeOyJ67x/jxE+72Uo6ristGeXBTo0AmAggl21SJGgQBiZhvvbLPG985wibC389Kfv+va2ZVRJyF8QHSG5MdPk9zU+E1p9/p8cODESmGqJCK0LMGVahVCXErZgVEtikz333tFkUVmVXw+VXNp5cl7/3jc6q2JnQz7HRKXVUcf/pfQl3jCNzqJnQEIhEjymFm6CdCYJsw+2x6q0qIiinbhtq3LNYtRRMpqsAv//QX5kWJcSmxXHPx2TGXSYoMDeuzM44vl5REALqJ5f445aBjQQR9JhBU8TGgqpjlqiJLLWsPKgaP8tlXl3z0t0cYhNA2XJ7PuPPW90juTammA5L9Dne6CbupY41y96DPnW5KbgQBAtD+vy2Cubje4CPcrDyNj4SgxKj86u0PuSzWqHOohUnP0Z6e48uaH7y4xxt7HXacgMINhl5uSUUw8qyUCIgBEYyqsKkDF1cliSjDbsLeIOPj/zzhF394lxAqXG759L2PKB+fkIult5+zu5uwk21/V1nWaIg0cdsLrxE0bpElislzx2zRsCw9icDdvQ73p31ya/j5b9/l7Y8f0qYJHz48ZZMIrYmE2vPKQZ/EwtxHjpcVF02kRfBA0K1t39DR3FxXnFyU3BQNXy8aisrz1y/mbBSKTc1Pf/1njr3y+mu3qOZzmmIN88jlacVF4WmAR4uaTRQyK7TPUGzEYIzgjMU8vWk4ebqhbAJRhOPLklnRUtQeRHh4esPP/viAzWCHbGfEzr077B9O2DPKJLXs5o6uS7iqW66aQKvgjPmGWADY0c7eT87mFaqKKjQh4qMCyiCxtFG5nG/45MkV415KHiuulwXH8xXBWp7rZ/gQeDCvWbTKqJewP0yZr5stHQVsf7j3k5vS46wlRKX1kdRCGyFLDJk1eFVuypr3H51x/nSFhIjr5SQxEivP18uGk8ZzNM55/c6Ap4uKRRWxxtDNLK7YVKgGUuNoYyBIIDFCVMVHQ+4M+TPxum1459Epn3yRMOk4Rij3eylelEFuePPFPufziovFBmcgSyCzwv8Aho+VQ8rzPS4AAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDMtMjZUMTk6MTI6MDErMDA6MDANUGWvAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTAzLTI2VDE5OjEyOjAxKzAwOjAwfA3dEwAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wMy0yNlQxOToxMjowNSswMDowMN9X2N8AAAAASUVORK5CYII=
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/553531/Dreamman.user.js
// @updateURL https://update.greasyfork.org/scripts/553531/Dreamman.meta.js
// ==/UserScript==

(function() {
    async function sleep(milliseconds) {
        await new Promise(r => setTimeout(r, milliseconds))
    }

    function Now() {
        return new ServerDate()
    }

    function parseConsumableBonuses(bonuses) {
        const { energyText, motivationText, healthText, speedText, luckText, dropText, experienceText, moneyText } = Vajda.searchKeys[Vajda.language]

        const result = {
            energy: 0,
            health: 0,
            motivation: 0,
            hasBuffs: false,
            buffs: {
                character: {
                    luck: 0,
                    money: 0,
                    experience: 0,
                    drop: 0
                },
                travel: 0
            }
        }

        function getValue(bonus, bonusText) {
            return Number(bonus.toLowerCase().replace(bonusText.toLowerCase(), '').replace(' ', '').replace('%', '').replace('+', ''))
        }

        for (const bonus of bonuses) {
            if ( bonus.includes(energyText) ) {
                result.energy = getValue(bonus, energyText)
                continue
            }

            if ( bonus.includes(motivationText) ) {
                result.motivation = getValue(bonus, motivationText)
                continue
            }

            if ( bonus.includes(healthText) ) {
                result.health = getValue(bonus, healthText)
                continue
            }

            if ( bonus.includes(speedText) ) {
                result.buffs.travel = getValue(bonus, speedText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(luckText) ) {
                result.buffs.character.luck = getValue(bonus, luckText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(experienceText) ) {
                result.buffs.character.experience = getValue(bonus, experienceText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(moneyText) ) {
                result.buffs.character.money = getValue(bonus, moneyText)
                result.hasBuffs = true
                continue
            }

            if ( bonus.includes(dropText) ) {
                result.buffs.character.drop = getValue(bonus, dropText)
                result.hasBuffs = true
            }
        }

        return result
    }

    class JobPoolJob {
        constructor(id, set = -1, keep = false) {
            this.id = id
            this._set = set
            this.keepAnyway = keep
            this.prio = 1
        }

        get set() {
            if ( this._set === -1 ) {
                return Vajda.nightshiftWorker.defaultSet
            }

            return this._set
        }

        set set(val) {
            this._set = val
        }

        remove() {
            const pool = Vajda.nightshiftWorker.jobPool
            const index = pool.findIndex(j => j.id === this.id)
            pool.splice(index, 1)
        }
    }


    class Job {
        constructor(x, y, id, groupId) {
            this.x = x
            this.y = y
            this.id = id
            this.groupId = groupId
            this.isSilver = false
            this.distances = []
            this.experience = 0
            this.money = 0
            this.motivation = 0
            this.stopMotivation = 75
            this.set = -1
            this.bestEquipment_ = undefined
        }

        setIsSilver(val) {
            this.isSilver = val
            return this
        }

        setExperience(val) {
            this.experience = val
            return this
        }

        setMoney(val) {
            this.money = val
            return this
        }

        setMotivation(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.motivation = valOrUpdater(this.motivation)
            } else {
                this.motivation = valOrUpdater
            }

            Vajda.noMotivationJob?.setMotivation(valOrUpdater)

            this.motivation = Math.min(100, this.motivation)

            return this
        }

        setStopMotivation(val) {
            this.stopMotivation = val
            return this
        }

        setSet(val) {
            this.set = val
            return this
        }

        getDistances() {
            return this.distances
        }

        async loadMotivation() {
            await Ajax.get('job', 'job', {jobId: this.id, x: this.x, y: this.y}, (r) => {
                this.motivation = r.motivation * 100
            })

            return this.motivation
        }

        calculateDistanceToTarget(x, y) {
            return GameMap.calcWayTime({x: this.x, y: this.y}, {x, y})
        }

        /**
         * Calculate job distance to current character position
         */
        calculateDistance() {
            this.distance = GameMap.calcWayTime({x: this.x, y: this.y}, Character.position)
            return this.distance
        }

        /**
         * Calculate job distance to other selected jobs
         */
        calculateJobDistances() {
            this.distances = []
            for ( const job of Vajda.addedJobs ) {
                this.distances.push(GameMap.calcWayTime({x: this.x, y: this.y}, {x: job.x, y: job.y}))
            }
            return this.distances
        }


        saveBestEquipment() {
            const skills = JobsModel.Jobs.find(j => j.id === this.id).get('skills')
            const set = west.item.Calculator.getBestSet(skills, this.id)
            const itemIds = set && set.getItems() || []
            this.bestEquipment_ = itemIds
            return itemIds
        }

        get bestEquipment() {
            return this.bestEquipment_ === undefined ? this.saveBestEquipment() : this.bestEquipment_
        }


        getBestEquipment() {
            if (!Bag.loaded) {
                EventHandler.listen('inventory_loaded', function() {
                    this.getBestEquipment()
                    return EventHandler.ONE_TIME_EVENT
                })
                return
            }

            const items = Bag.getItemsByItemIds(this.bestEquipment)
            const result = []

            for (const item of items) {
                const wearItem = Wear.get(item.getType())
                if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== item.getItemBaseId() || wearItem.getItemLevel() < item.getItemLevel()))) {
                    result.push(item)
                }
            }
            return result.map(item => item.obj.getId())
        }

        getNearestNonSilver() {
            if ( this.isSilver === false ) return this

            const nearest = Vajda.allJobs.filter(j => !Vajda.isJobSilver(j.x, j.y, j.id) && j.id === this.id).reduce((prev, curr) => {
                return prev.calculateDistanceToTarget(this.x, this.y) < curr.calculateDistanceToTarget(this.x, this.y)
                    ?  prev : curr
            })

            return nearest
        }

        getJobToWalkTo() {
            const jobGroup = JobList.getJobsByGroupId(this.groupId)

            const jobToWalkTo = jobGroup.map(j =>
                j.id
            ).map( id => {
                const j = JobsModel.getById(id)

                return {
                    id: id,
                    workpoints: j.workpoints,   //required LP
                    jobpoints: j.jobpoints      //character has LP
                }
            }).reduce((prev, curr) => {
                return prev.workpoints < curr.workpoints ? prev : curr
            })

            return jobToWalkTo
        }
    }

    class MotivationJob extends Job {
        constructor(job) {
            super(job.x, job.y, job.id, job.groupId)
            this.motivation = 100
            this.spendMotivation_ = false
            this.stopMotivation = 0
            this.isSilver = false
            this.experience = job.experience
            this.money = job.money
            this.noPbEquipment = {}
            this.currentLevel = Character.level
            this.html = null
        }

        updateHTML() {
            const elem = this.html.find('#single-job-imported-sets')
            const levels = []
            let text = 'Imported sets for levels: '
            for ( const key in this.noPbEquipment ) {
                levels.push(key.replace('level_', ''))
            }
            elem.text(text.concat(levels.join(', ')))
        }

        getJobToWalkTo() {
            return this
        }

        getBestEquipment() {
            if ( this.currentLevel < Character.level ) {
                this.currentLevel = Character.level
            }

            if ( !this.noPbEquipment[`level_${this.currentLevel}`] ) return []

            const equip = this.noPbEquipment[`level_${this.currentLevel}`]
            const res = []
            for ( const slot of Wear.slots ) {
                if ( equip[slot] === undefined && Wear.wear[slot] !== undefined ) {
                    Wear.uncarry(slot)
                    continue
                }

                if ( equip[slot] === Wear.wear[slot]?.getId() ) {
                    continue
                }

                res.push(equip[slot])
            }
            return res
        }

        deleteCurrentEquip(level) {
            delete this.noPbEquipment[`level_${level}`]
            new UserMessage(`Equip for level ${level} deleted`, UserMessage.TYPE_SUCCESS).show()
            this.updateHTML()
        }

        saveCurrentEquip(level) {
            const equip = {}

            for ( const slot of Wear.slots ) {
                equip[slot] = Wear.wear[slot]?.getId()
            }

            this.noPbEquipment[`level_${level}`] = equip
            this.updateHTML()
            new UserMessage(`Equip for level ${level} saved`, UserMessage.TYPE_SUCCESS).show()
        }

        exportEquip() {
            const blob = new Blob([JSON.stringify(this.noPbEquipment, null, 2)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            const name = JobsModel.getById(this.id)?.jobObj.name.replace(' ', '_')
            link.download = `${name}.json`

            document.body.appendChild(link)
            link.click()

            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        }

        importEquip(file) {
            const reader = new FileReader()

            reader.onload = e => {
                const fileContents = e.target.result
                const sets = JSON.parse(fileContents)

                this.noPbEquipment = sets
                this.updateHTML()
                new UserMessage('Equipment import successful', UserMessage.TYPE_SUCCESS).show()
            }

            reader.readAsText(file)
        }

        setMotivation(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.motivation = valOrUpdater(this.motivation)
            } else {
                this.motivation = valOrUpdater
            }

            this.motivation = Math.min(100, this.motivation)

            return this
        }

        get spendMotivation() {
            return Vajda.addedJobs.length === 1 ? this.spendMotivation_ : false
        }

        set spendMotivation(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.spendMotivation_ = valOrUpdater(this.spendMotivation_)
            } else {
                this.spendMotivation_ = valOrUpdater
            }
        }
    }

    class Consumable {
        constructor(id, image, name) {
            this.id = id
            this.image = image
            this.name = name
            this.energy = 0
            this.motivation = 0
            this.health = 0
            this.isSelected_ = false
            this.count = 0
        }

        isCakeDecoration() {
            return this.id === 53339000
        }

        removeOne() {
            this.count -= 1

            if ( this.count === 0 ) {
                const consumables = Manager.consumables
                const index = consumables.findIndex(c => c.id === this.id)
                consumables.splice(index, 1)
            }
            return this
        }

        setCount(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.count = valOrUpdater(this.count)
            } else {
                this.count = valOrUpdater
            }

            this.count = Math.max(0, this.count)
            return this
        }

        setEnergy(val) {
            this.energy = val
            return this
        }

        setMotivation(val) {
            this.motivation = val
            return this
        }

        setHealth(val) {
            this.health = val
            return this
        }

        setIsSelected(isSelected) {
            this.isSelected_ = isSelected
            return this
        }

        hasCooldown() {
            return this.energy > 0 || this.motivation > 0 || this.health > 0
        }

        getBuffHTML() {
            return '<strong>No Buffs</strong>'
        }

        get isSelected() {
            return this.isSelected_
        }
    }

    class Buff extends Consumable {
        constructor(id, image, name, buffs) {
            super(id, image, name, buffs)
            this.buffs_ = buffs
        }

        getBuffImage() {
            return `https://westsk.innogamescdn.com/images/buffs/${this.getBuffType()}.jpg`
        }

        getBuffType() {
            return this.buffs_.travel === 0 ? 'character' : 'travel'
        }

        canUseAsBuff() {
            return CharacterSkills.buffs[this.getBuffType()] === null && !this.hasCooldown()
        }

        getBuffHTML() {
            const containerStyle = `'
                display: grid;
                grid-template-columns: 30px auto;
            '`

            const imgContainerStyle = `'
                display: flex;
                padding-bottom: 5px;
            '`

            const buffsContainerStyle = `'
                display: grid;
                grid-template-rows: repeat(auto-fill, 15px);
                transform: translateY(5px)
            '`
            const buffs = this.buffs.reduce((acc, b) => acc.concat(`<p>${b}</p>`), '')

            const html = `
                <div style=${containerStyle}>
                    <span style=${imgContainerStyle}>
                        <img style=align-self:end width=25px height=25px src=${this.getBuffImage()} alt='Buff Image'>
                    </span>

                    <span style=${buffsContainerStyle}>
                        ${
                            buffs
                        }
                    </span>
                </div>
            `

            return html
        }

        removeOne() {
            this.count -= 1

            if ( this.count === 0 ) {
                const consumables = Manager.consumables
                const buffs = Manager.buffs
                let index = consumables.findIndex(c => c.id === this.id)
                if ( index !== -1 ) {
                    consumables.splice(index, 1)
                    return this
                }
                index = buffs.findIndex(b => b.id === this.id)
                if ( index !== -1 ) {
                    buffs.splice(index, 1)
                    if ( Manager.selectedBuffs.some(b => b.id === this.id) ) {
                        Manager.selectedBuffs_[this.getBuffType()] = null
                    }
                }
            }
            return this
        }

        get isSelected() {
            return Manager.selectedBuffs.some(b => b.id === this.id) || this.isSelected_
        }


        get buffs() {
            if ( this.getBuffType() === 'travel' ) {
                return [`+${this.buffs_.travel}% speed`]
            }

            const buffs = []
            for ( const buff in this.buffs_.character ) {
                if ( this.buffs_.character[buff] > 0 ) {
                    buffs.push(`+${this.buffs_.character[buff]}% ${buff}`)
                }
            }
            return buffs
        }
    }


    class ConsumablesManager {
        constructor() {
            this.consumables_ = []
            this.buffs_ = []
            this.isOptimized_ = false
            this.jobsLeftInRound_ = 0
            this.schedule_ = []
            this.selectedBuffs_ = {
                travel: null,
                character: null
            }
            this.consumablesSelection = null
        }

        async loadJobMotivation(updatedJobsMotivation = undefined) {
            let expectedJobCount = 0
            const uniqueJobsCount = Vajda.addedJobs.length

            if ( updatedJobsMotivation !== undefined ) {
                expectedJobCount = updatedJobsMotivation.reduce((acc, curr) => acc + curr, 0)

                return { expectedJobCount, uniqueJobsCount }
            }

            for ( const job of Vajda.addedJobs ) {
                expectedJobCount += Math.max(await job.loadMotivation() - job.stopMotivation, 0)

                await sleep(500)
            }

            return { expectedJobCount, uniqueJobsCount }
        }

        async createSchedule(updatedJobsMotivation) {
            const bottlePlugs = this.consumables.find(c => c.id === 52871000)

            //in case the game runs in the background and the job to travel to is not canceled we gonna need extra energy point
            //this is unlikely to happen but the energy wont go to waste anyway so why the fuck not
            const { expectedJobCount, uniqueJobsCount } = await this.loadJobMotivation(updatedJobsMotivation)

            this.jobsLeftInRound = expectedJobCount

            const availableEnergy = Character.energy
            const energyToFill = expectedJobCount + uniqueJobsCount - availableEnergy
            const refillCount = Math.ceil(
                energyToFill / ( bottlePlugs.energy / 100 * Character.maxEnergy )
            )

            //use plugs when n jobs left in round
            const schedule = []

            for ( let i = 0; i < refillCount; i++ ) {
                //40 15s jobs in consumable cooldown
                schedule.push(40 + i*40)
            }

            this.schedule_ = schedule

            return schedule
        }

        isScheduledRefill(jobCount) {
            const isScheduled = this.isOptimized_ && this.refillsLeft > 0 && this.jobsLeftInRound <= this.schedule.at(-1)
            const isEnergyLow = this.isOptimized_&& this.refillsLeft > 0 && Character.energy - jobCount <= 10
            return isScheduled || isEnergyLow
        }

        async checkSchedule(jobCount) {
            const bottlePlug = this.consumables.find(c => c.id === 52871000)

            for ( let i = 0; i < jobCount; i++ ) {
                this.jobsLeftInRound = p => p - 1
                if ( this.isScheduledRefill(jobCount) ) {
                    //the use of consumable blocks the start of new jobs for a short amount of time, so this sleep exists to prevent that
                    await sleep(10000)
                    this.useConsumableOrWaitForCooldown(bottlePlug)
                    this.schedule.pop()
                    this.jobsLeftInRound = p => p - (jobCount - i - 1)
                    return
                }
            }
        }

        canUseConsumable(consumable) {
            if ( consumable instanceof Buff ) {
                return consumable.canUseAsBuff()
            }

            if ( BuffList.cooldowns[consumable.id] !== undefined && BuffList.cooldowns[consumable.id].time > new ServerDate().getTime() ) {
                return false
            }
            return true
        }

        findProperConsumable(motivationMissing, energyMissing, averageMotivationMissing) {
            const consumablesPool = this.getSelectedConsumables()

            function betterEnergy(item1, item2) {
                let distanceItem1 = Math.abs(energyMissing - item1.energy)
                let distanceItem2 = Math.abs(energyMissing - item2.energy)
                return (distanceItem1 < distanceItem2 ) ? -1 : (distanceItem1 > distanceItem2) ? 1 : 0
            }
            function betterMotivation(item1, item2) {
                let distanceItem1 = Math.abs(averageMotivationMissing - item1.motivation)
                let distanceItem2 = Math.abs(averageMotivationMissing - item2.motivation)
                return (distanceItem2 < distanceItem1) ? item2 : item1
            }
            function findMotivationConsume(consumes) {
                let consumeToChoose = null
                for ( let i = 0; i < consumes.length; i++ ) {
                    if ( consumeToChoose === null && consumes[i].motivation !== 0) {
                        consumeToChoose = consumes[i]
                        continue
                    }

                    if ( consumeToChoose !== null && consumes[i].motivation !== 0) {
                        consumeToChoose = betterMotivation(consumeToChoose, consumables[i])
                    }
                }
                return consumeToChoose
            }
            function findHealthConsume(consumes) {
                for ( let i = 0; i < consumes.length; i++ ) {
                    if ( consumes[i].health !== 0 ) {
                        return consumes[i]
                    }
                }
                return null
            }

            if ( consumablesPool.length  === 0 ) return null

            const consumables = consumablesPool.sort(betterEnergy)

            if ( Vajda.settings.addEnergy && energyMissing === 100 ) {
                return consumables[0]
            }

            if ( Vajda.settings.addMotivation && motivationMissing === Vajda.addedJobs.length ) {
                return findMotivationConsume(consumables)
            }

            if ( Vajda.settings.addHealth && Vajda.isHealthBelowLimit() ) {
                if ( this.isOptimized ) {
                    this.schedule.pop()
                }
                return findHealthConsume(consumables)
            }
        }

        async useConsumable(consumable) {
            const item = Bag.getItemByItemId(consumable.id)
            item.showCooldown()

            if ( Vajda.shouldEquipHealthSet(consumable) )
                await Vajda.equipSet(Vajda.healthSet)

            ItemUse.doIt(consumable.id)
            consumable.removeOne()

            while(true) {
                if ( !this.canUseConsumable(consumable) ) {
                    $('.tw2gui_dialog_framefix').remove()
                    break
                }
                await sleep(1)
            }

            Vajda.currentState = 1
        }

        async useConsumableOrWaitForCooldown(consumableOrId, isSync = false) {
            const consumable = consumableOrId instanceof Consumable ? consumableOrId : this.getSelectedConsumables().find(c => c.id === consumableOrId)
            if ( consumable === undefined ) {
                return false
            }

            Vajda.currentState = 2

            while (true) {
                if ( consumable.hasCooldown() === false || this.canUseConsumable(consumable) ) {
                    break
                }

                if ( !Vajda.isRunning ) {
                    return
                }

                await sleep(1000)
            }
            Vajda.currentState = 5
            await this.useConsumable(consumable)

            isSync && Vajda.run()
        }

        isConsumableAdded (item) {
            if ( item === undefined )
                return true
            for ( const consumable of this.consumables_ ) {
                if ( consumable.id === item.obj.item_id ) {
                    return true
                }
            }
            for ( const buff of this.buffs_ ) {
                if ( buff.id === item.obj.item_id ) {
                    return true
                }
            }
            return false
        }

        useBuff(type) {
            const buff = this.selectedBuffs_[type]

            if ( buff?.canUseAsBuff() && !Vajda.isWastingMotivation() ) {
                this.useConsumable(buff)
            }
        }

        addNewConsumable(item) {
            if ( this.isConsumableAdded(item) ) {
                return
            }

            const { energy, motivation, health, hasBuffs, buffs } = parseConsumableBonuses(item.obj.usebonus)

            if ( health === 0 && motivation === 0 && energy === 0 && !hasBuffs )
                return

            if ( hasBuffs ) {
                const buff = new Buff(item.obj.item_id, item.obj.image, item.obj.name, buffs)
                    .setEnergy(energy)
                    .setMotivation(motivation)
                    .setHealth(health)
                    .setCount(item.count)

                return buff.hasCooldown() ? this.consumables_.push(buff) : this.buffs_.push(buff)
            }

            const consumable = new Consumable(item.obj.item_id, item.obj.image, item.obj.name)
                .setEnergy(energy)
                .setMotivation(motivation)
                .setHealth(health)
                .setCount(item.count)
            this.consumables.push(consumable)
        }

        hasEnoughPlugsAndDecorations() {
            const bottlePlugs = this.consumables.find(c => c.id === 52871000)
            const decorations = this.consumables.find(c => c.id === 53339000)

            if ( !bottlePlugs || !decorations ) {
                new UserMessage("No plugs or decorations were found, defaulting back to selected consumables", UserMessage.TYPE_HINT).show()
                this.isOptimized_ = false
                return false
            }
            return true
        }

        getSelectedConsumables() {
            if ( this.isOptimized_ ) {
                const bottlePlugs = this.consumables.find(c => c.id === 52871000)
                const decorations = this.consumables.find(c => c.id === 53339000)

                return [bottlePlugs, decorations]
            } else {
                return this.consumables.filter(c => c.isSelected === true)
            }
        }

        addSelectedConsumable(val) {
            if ( typeof val === 'number' )
                this.consumables.at(val).isSelected = true

            if ( val instanceof Consumable )
                this.consumables.find(c => c.id === val.id).isSelected = true
        }

        saveConsumables() {
            const data = {
                consumables: this.consumables_,
                buffs: this.buffs_,
                selectedBuffs: this.selectedBuffs_
            }
            localStorage.setItem(`${location.hostname}-vajda-consumables`, JSON.stringify(data))
        }

        loadConsumables() {
            Bag.updateCooldowns()

            const storageData = localStorage.getItem(`${location.hostname}-vajda-consumables`)

            if ( storageData === null ) return false

            const data = JSON.parse(storageData)

            const resBuffs = [], resConsumables = []

            data.consumables.forEach(c => {
                let consumable
                if ( c.buffs_ ) {
                    consumable = new Buff(c.id, c.image, c.name, c.buffs_)
                } else {
                    consumable = new Consumable(c.id, c.image, c.name)
                }

                consumable
                    .setCount(c.count)
                    .setEnergy(c.energy)
                    .setHealth(c.health)
                    .setMotivation(c.motivation)
                    .setIsSelected(c.isSelected_)
                resConsumables.push(consumable)
            })

            data.buffs.forEach(b => {
                const buff = new Buff(b.id, b.image, b.name, b.buffs_)
                buff
                    .setCount(b.count)
                    .setEnergy(b.energy)
                    .setHealth(b.health)
                    .setMotivation(b.motivation)
                    .setIsSelected(b.isSelected_)

                resBuffs.push(buff)
            })

            this.consumables_ = resConsumables
            this.buffs_ = resBuffs
            if ( data.selectedBuffs.travel ) {
                this.selectedBuffs_.travel = resBuffs.find(b => b.id === data.selectedBuffs.travel.id)
            }

            if ( data.selectedBuffs.character ) {
                this.selectedBuffs_.character = resBuffs.find(b => b.id === data.selectedBuffs.character.id)
            }

            localStorage.removeItem(`${location.hostname}-vajda-consumables`)
            return true
        }

        get schedule() {
            return this.schedule_
        }

        set schedule(val) {
            this.schedule_ = val
        }

        get consumables() {
            return this.consumables_
        }

        set consumables(val) {
            this.consumables_ = val
        }

        get isOptimized() {
            return this.isOptimized_
        }

        set isOptimized(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.isOptimized_ = valOrUpdater(this.isOptimized_)
            } else {
                this.isOptimized_ = valOrUpdater
            }
        }

        get jobsLeftInRound() {
            return this.jobsLeftInRound_
        }

        set jobsLeftInRound(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this.jobsLeftInRound_ = valOrUpdater(this.jobsLeftInRound_)
            } else {
                this.jobsLeftInRound_ = valOrUpdater
            }
        }

        get refillsLeft() {
            return this.schedule.length
        }

        get buffs() {
            return this.buffs_
        }

        get selectedBuffs() {
            const res = []
            for ( const type in this.selectedBuffs_ ) {
                this.selectedBuffs_[type] && res.push(this.selectedBuffs_[type])
            }

            return res
        }

        set selectedBuffs(buff) {
            const type = buff.getBuffType()
            if ( this.selectedBuffs_[type]?.id === buff.id ) {
                this.selectedBuffs_[type] = null

                return
            }
            this.selectedBuffs_[type] = buff
            new UserMessage(`New ${type} buff selected`, UserMessage.TYPE_SUCCESS).show()
        }
    }


    class ActivityObserver {
        constructor() {
            const fiveMinutes = 5 * 60 * 1000
            this.activityCheckTimeout_ = null
            this.refreshCount = 0
            this._isEnabled = false
            this.timeOut_ = fiveMinutes
        }

        saveTempCookies() {
            const timeOut = this.timeOut_
            const settings = {
                statistics: Vajda.statistics,
                timeOut,
                direction: Vajda.direction,
                currentJob: Vajda.currentJob,
                refreshCount: this.refreshCount + 1,
                schedule: Manager.schedule,
                jobsLeftInRound: Manager.jobsLeftInRound,
                travelSet: Vajda.travelSet,
                jobSet: Vajda.jobSet,
                healthSet: Vajda.healthSet
            }

            const expiracyDateTemporary = new Date()
            const hour = expiracyDateTemporary.getHours()
            expiracyDateTemporary.setHours(2,0,0)

            if ( hour > 2 )
                expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1)

            Manager.saveConsumables()

            document.cookie = `vajdasession=${JSON.stringify(settings)};expires=${expiracyDateTemporary.toGMTString()};`
        }

        getTempCookies() {
            const cookies = document.cookie.split("=")
            for ( let i = 0; i < cookies.length; i++ ) {
                if ( cookies[i].includes("vajdasession") ) {
                    const {
                        timeOut, schedule, selectedConsumables, buffs, jobsLeftInRound, refreshCount, ...vajdaSettings
                    } = JSON.parse(cookies[i+1].split(";")[0])

                    this.refreshCount = refreshCount
                    this.timeOut_ = timeOut
                    this.isEnabled = true
                    Manager.jobsLeftInRound = jobsLeftInRound
                    Manager.schedule = schedule
                    Vajda = {...Vajda, ...vajdaSettings, isRunning: true}
                    document.cookie = 'vajdasession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
                    Manager.loadConsumables()
                    return true
                }
            }

            return false
        }

        restartSession() {
            if ( Vajda.currentState === 2 ) {
                this.start()
                return
            }

            this.saveTempCookies()
            location.reload()
        }

        resumeSession() {
            if ( !this.getTempCookies() ) {
                console.log('didn\'t find cookies')
                return
            }
            setTimeout(() => {
                Vajda.createWindow(false)
                Vajda.beginRun(false)
            }, 10000)
        }

        start(forceStart = false) {
            if ( !this.isEnabled && !forceStart ) return

            clearTimeout(this.activityCheckTimeout_)
            this.activityCheckTimeout_ = setTimeout(this.restartSession.bind(this), this.timeOut_)
        }

        stop() {
            this.isEnabled = false
            if ( this.activityCheckTimeout_ !== null )
                clearTimeout(this.activityCheckTimeout_)
            this.activityCheckTimeout_ = null
        }

        getTimeOut(convertToMinutes) {
            if ( convertToMinutes ) {
                return this.timeOut_ / 1000 / 60
            }
            return this.timeOut_
        }

        get isEnabled() {
            return this._isEnabled
        }

        set isEnabled(valOrUpdater) {
            if ( typeof valOrUpdater === 'function' ) {
                this._isEnabled = valOrUpdater(this._isEnabled)
            } else {
                this._isEnabled = valOrUpdater
            }
        }

        set timeOut(val) {
            this.timeOut_ = Math.max(Number(val) * 60 * 1000, 2.5 * 60 * 1000)
        }
    }

    window.Manager = new ConsumablesManager()
    window.Observer = new ActivityObserver()

    window.Vajda = {
        addedJobs: [],
        allJobs: [],
        addedJobTablePosition: {
            content: "0px",
            scrollbar:"0px"
        },
        consumableSelection: {
            energy: false,
            motivation: false,
            health: false,
            hideBuffs: false
        },
        consumableTablePosition: {
            content: '0px',
            scrollbar: '0px'
        },
        consumableUsed: [],
        currentJob: {
            job: 0,
            direction: true
        },
        currentState: 0,
        healthSet: -1,
        language: "",
        isLoaded: false,
        isRunning: false,
        jobFilter: {
            filterOnlySilver: false,
            filterNoSilver: false,
            filterCenterJobs: false,
            filterJob: ""
        },
        jobSet: -1,
        jobsLoaded: false,
        jobTablePosition: {
            content: "0px",
            scrollbar: "0px"
        },
        nightshiftWorker: {
            isEnabled: false,
            jobPool: [],
            defaultSet: -1,
            limit: 17,
            swapTime: '3:00'
        },
        noMotivationJob: null,
        lastJobStartTime: undefined,
        states: [
            'Idle',
            'Running',
            'Waiting for a consumable cooldown',
            'Calculating optimal route',
            'Swapping silver jobs',
            'Consumable use failed'
        ],
        statistics: {
            sessionJobsCount: 0,
            sessionXpCount: 0,
            sessionMoneyCount: 0,
            totalJobsCount: 0,
            totalXpCount: 0,
            totalMoneyCount: 0
        },
        selectedSet: 0,
        sets: null,
        settings: {
            addEnergy: false,
            addMotivation: false,
            addHealth: false,
            minHP: 1000,
            setWearDelay: 5,
            addDeposit: {
                isEnabled: false,
                limit: NaN
            },
            rememberSelection: {
                consumables: false,
                travelBuff: false,
                characterBuff: false
            }
        },
        sortJobTableXp:0,
        sortJobTableDistance:0,
        travelSet: -1,
        regenerationSet: -1,
        window: null,
        searchKeys: {
            "en_DK":{
                energy:"Energy",
                energyText:"Energy increase:",
                motivation:"Work motivation",
                motivationText:"Work motivation increase:",
                health: "Health point bonus",
                healthText:"Health point bonus:"
            },
            "sk_SK": {
                energy:"Energie",
                energyText:"Zvýšenie energie:",
                motivation:"Pracovnej motivácie",
                motivationText:"Zvýšenie pracovnej motivácie:",
                health: "Bonus bodov zdravia",
                healthText:"Bonus bodov zdravia:",
                speedText: "Rýchlosť",
                experience: "skúseností",
                experienceText: "Skúseností z práce, duelov a boja o pevnosť",
                money: "peňazí",
                moneyText: "Peňazí z práce a duelov",
                luck: "šťastie",
                luckText: "Vylepšené šťastie",
                drop: "produktu",
                dropText: "Vylepšenie šance na získanie produktu"
            },
            "cs_CZ":{
                energy:"Energie",
                energyText:"Zvýšení energie:",
                motivation:"Pracovní motivace",
                motivationText:"Zvýšení pracovní motivace:",
                health: "Bonus zdraví",
                healthText:"Bonus zdraví:",
                speedText: "Rychlost",
                experience: "zkušeností",
                experienceText: "zkušeností z prací, duelů a bitev o pevnost",
                money: "prací",
                moneyText: "$ z prací a duelů",
                luck: "štěstí",
                luckText: "Vyšší šance na štěstí",
                drop: "produktu",
                dropText: "Vylepšené šance nálezu produktu"
            },
            "hu_HU":{
                energy:"Energia növekedése:",
                energyText:"Energia növekedése:",
                motivation:"Munka motiváció növelése:",
                motivationText:"Munka motiváció növelése:",
                health: "Életerő bónusz",
                healthText:"Életerő bónusz:"
            },
            "pl_PL":{
                energy:"Wzrost energii:",
                energyText:"Wzrost energii:",
                motivation:"Zwiększenie motywacji do pracy:",
                motivationText:"Zwiększenie motywacji do pracy:",
                health: "Bonus Punktów życia:",
                healthText:"Bonus Punktów życia:"
            },
            "ro_RO":{
                energy:"Energie mărită:",
                energyText:"Energie mărită:",
                motivation:"Creştere a motivaţiei de muncă:",
                motivationText:"Creştere a motivaţiei de muncă:",
                health: "Puncte de viaţă:",
                healthText:"Puncte de viaţă:"
            }
         },

         isNumber: function(potentialNumber) {
            return Number.isInteger(parseInt(potentialNumber))
        },

        RNG: function(min, max) {
            let minN = Math.min(min, max)
            let maxN = Math.max(min, max)

            let number =  Math.floor((minN + Math.random() * (maxN - minN + 1)))
            return number
        },

        isAllowedToDepositMoney: function() {
            const hasMoreMoneyThanLimit = Vajda.settings.addDeposit.limit <= Character.money
            const hasHomeTown = Character.homeTown.town_id !== 0

            if ( hasHomeTown === false ) {
                return false
            }

            return this.settings.addDeposit.isEnabled && hasMoreMoneyThanLimit
        },

        setCookies: function() {
            let expiracyDateTemporary = new Date()
            let hour = expiracyDateTemporary.getHours()
            expiracyDateTemporary.setHours(2,0,0)
            if ( hour > 2 )
                expiracyDateTemporary.setDate(expiracyDateTemporary.getDate() + 1)

            const addedJobs = this.addedJobs.map(j => ({
                x: j.x,
                y: j.y,
                id: j.id,
                groupId: j.groupId,
                isSilver: j.isSilver,
                experience: j.experience,
                money: j.money,
                motivation: j.motivation,
                stopMotivation: j.stopMotivation,
                set: j.set
            }))

            const temporaryObject = {
                addedJobs,
                travelSet: this.travelSet,
                jobSet: this.jobSet,
                healthSet: this.healthSet,
                currentJob: this.currentJob
            }
            let expiracyDatePernament = new Date()
            expiracyDatePernament.setDate(expiracyDatePernament.getDate() + 360000)
            const permanentObject = {
                settings: {...this.settings, isOptimized: Manager.isOptimized, isEnabled: Observer.isEnabled, timeOut: Observer.getTimeOut(true)},
                totalJobs: this.statistics.totalJobsCount,
                totalXp: this.statistics.totalXpCount,
                totalMoney: this.statistics.totalMoneyCount,
                nightshiftWorker: this.nightshiftWorker
            }
            if ( this.settings.rememberSelection.travelBuff ) {
                permanentObject.travelBuff = Manager.selectedBuffs_.travel?.id
            }
            if ( this.settings.rememberSelection.characterBuff ) {
                permanentObject.characterBuff = Manager.selectedBuffs_.character?.id
            }
            if ( this.settings.rememberSelection.consumables ) {
                permanentObject.consumables = Manager.consumables.filter(c => c.isSelected).map(c => c.id)
            }
            const jsonTemporary = JSON.stringify(temporaryObject)
            const jsonPermanent = JSON.stringify(permanentObject)
            document.cookie = `vajdatemporary=${jsonTemporary};expires=${expiracyDateTemporary.toGMTString()};`
            document.cookie = `vajdapermanent=${jsonPermanent};expires=${expiracyDatePernament.toGMTString()};`
        },

        getCookies: function() {
            const cookies = document.cookie.split("=")
            for ( let i = 0; i < cookies.length; i++ ) {
                if ( cookies[i].includes("vajdatemporary") ) {
                    const obj = cookies[i+1].split(";")
                    const tempObject = JSON.parse(obj[0])
                    const tmpAddedJobs = tempObject.addedJobs

                    for ( const job of tmpAddedJobs ) {
                        const newJob = new Job(job.x, job.y, job.id, job.groupId)
                            newJob
                                .setIsSilver(job.isSilver)
                                .setExperience(job.experience)
                                .setMoney(job.money)
                                .setMotivation(job.motivation)
                                .setStopMotivation(job.stopMotivation)
                                .setSet(job.set)
                            this.addedJobs.push(newJob)
                        }

                    this.travelSet = tempObject.travelSet
                    this.jobSet = tempObject.jobSet
                    this.healthSet = tempObject.healthSet
                    this.currentJob = tempObject.currentJob
                }
                if ( cookies[i].includes("vajdapermanent") ) {
                    const obj = cookies[i+1].split(";")
                    const permanentObject = JSON.parse(obj[0])
                    const { isOptimized, isEnabled, timeOut, ...settings } = permanentObject.settings
                    const jobPool = permanentObject.nightshiftWorker?.jobPool.map(j => new JobPoolJob(j.id, j._set, j.keepAnyway))

                    Manager.isOptimized = !!isOptimized
                    Observer.isEnabled = !!isEnabled
                    Observer.timeOut = timeOut || 5
                    this.settings = settings
                    if ( !settings.addDeposit ) {
                        this.settings.addDeposit = {
                            isEnabled: false,
                            limit: NaN
                        }
                    }
                    this.statistics.totalJobsCount = Math.floor(permanentObject.totalJobs)
                    this.statistics.totalXpCount = permanentObject.totalXp
                    this.statistics.totalMoneyCount = permanentObject.totalMoney
                    this.nightshiftWorker = permanentObject.nightshiftWorker ? { ...permanentObject.nightshiftWorker, jobPool} : undefined
                    Manager.consumablesSelection = {
                        travelBuff: permanentObject.travelBuff,
                        characterBuff: permanentObject.characterBuff,
                        consumables: permanentObject.consumables
                    }
                }
            }
        },

        shouldEquipHealthSet: function(consumable) {
            if ( !consumable.hasCooldown() ) {
                return false
            }

            if ( Manager.isOptimized ) {
                return false
            }

            return consumable.health > 0 && this.healthSet > -1
        },

        findAllConsumables: function() {
            if ( this.searchKeys[this.language] === undefined ) return
            const energyConsumables = Bag.search(this.searchKeys[this.language].energy)
            for ( const consumable of energyConsumables ) {
                Manager.addNewConsumable(consumable)
            }

            const motivationConsumables = Bag.search(this.searchKeys[this.language].motivation)
            for ( const consumable of motivationConsumables ) {
                Manager.addNewConsumable(consumable)
            }

            const healthConsumables = Bag.search(this.searchKeys[this.language].health)
            for ( const consumable of healthConsumables ) {
                Manager.addNewConsumable(consumable)
            }

            const speedConsumables = Bag.search(this.searchKeys[this.language].speedText)
            for ( const consumable of speedConsumables ) {
                if ( consumable.obj.usetype !== 'none' ) {
                    Manager.addNewConsumable(consumable)
                }
            }

            const luckConsumables = Bag.search(this.searchKeys[this.language].luck)
            for ( const consumable of luckConsumables ) {
                if ( consumable.obj.usetype !== 'none' ) {
                    Manager.addNewConsumable(consumable)
                }
            }

            const experienceConsumables = Bag.search(this.searchKeys[this.language].experience)
            for ( const consumable of experienceConsumables ) {
                if ( consumable.obj.usetype !== 'none' ) {
                    Manager.addNewConsumable(consumable)
                }
            }

            const moneyConsumables = Bag.search(this.searchKeys[this.language].money)
            for ( const consumable of moneyConsumables ) {
                if ( consumable.obj.usetype !== 'none' ) {
                    Manager.addNewConsumable(consumable)
                }
            }

            const dropConsumables = Bag.search(this.searchKeys[this.language].drop)
            for ( const consumable of dropConsumables ) {
                if ( consumable.obj.usetype !== 'none' ) {
                    Manager.addNewConsumable(consumable)
                }
            }

            if ( Manager.consumablesSelection?.travelBuff ) {
                Manager.selectedBuffs_.travel = Manager.buffs.find(b => b.id === Manager.consumablesSelection.travelBuff)
            }

            if ( Manager.consumablesSelection?.characterBuff ) {
                Manager.selectedBuffs_.character = Manager.buffs.find(b => b.id === Manager.consumablesSelection.characterBuff)
            }

            if ( Manager.consumablesSelection?.consumables ) {
                Manager.consumables.forEach(c => {
                    if ( Manager.consumablesSelection.consumables.some(con => con === c.id) ) {
                        c.setIsSelected(true)
                    }
                })
            }

            Manager.consumablesSelection = null
        },

        filterConsumables: function(energy, motivation, health, hideBuffs) {
            const result = hideBuffs ? [] : [...Manager.buffs]

            for ( const consumable of Manager.consumables ) {
                if ( energy && consumable.energy === 0 ) {
                    continue
                }

                if ( motivation && consumable.motivation === 0 ) {
                    continue
                }

                if ( health && consumable.health === 0 ) {
                    continue
                }
                result.push(consumable)
            }

            return result
        },

        changeConsumableSelection: function(id, isSelected) {
            Manager.consumables.find(c => c.id === id)?.setIsSelected(isSelected)
        },

        changeSelectionAllConsumables: function(selected) {
            for ( const consumable of Manager.consumables ) {
                consumable.setIsSelected(selected)
            }
        },

        loadSets: async function(callback) {
            Ajax.remoteCallMode('inventory', 'show_equip', {}, function(r) {
                Vajda.sets = r.data
                if ( callback !== undefined )
                    callback()
            })
        },

        loadJobMotivation: function(index, callback) {
            const job = this.addedJobs.at(index)
            Ajax.get('job', 'job', {jobId: job.id, x: job.x, y: job.y}, function(r) {
                if ( callback !== undefined )
                    callback(r.motivation*100)
            })
        },

        loadLanguage: function() {
            Ajax.remoteCall("settings", "settings", {}, function(resp) {
                Vajda.language = resp.lang.account.key
            })
        },

        loadJobs: function(isReset = false) {
            if ( !this.jobsLoaded ) {
                new UserMessage("Loading...", UserMessage.TYPE_HINT).show()
                Ajax.get('map', 'get_minimap', {}, r => this.handleLoadJobs(r, isReset))
            } else {
                Vajda.findAllConsumables()
                this.createWindow()
            }
        },

        loadJobData: function(callback) {
            Ajax.get('work','index', {}, (r) => {
                if( r.error ) {
                    console.log(r.error)
                    return
                }
                JobsModel.initJobs(r.jobs)
                callback()
            })
        },

        initSessionReload: function() {
            Manager.saveConsumables()
            localStorage.setItem(`${location.hostname}-vajda-travelset`, this.travelSet)
            location.reload()
        },

        initSilverJobsSwap: async function() {
            await sleep(20000)

            const isLoadSuccessful = Manager.loadConsumables()
            const travelSet = localStorage.getItem(`${location.hostname}-vajda-travelset`)
            if ( travelSet && travelSet !== -1 ) this.travelSet = travelSet

            if ( !isLoadSuccessful ) return

            Inventory.open(null, null, {category: 'yield'})

            while (true) {
                if ( wman.isWindowCreated(Inventory.uid) ) {
                    wman.closeAll()
                    break
                }
                await sleep(2000)
            }

            this.loadJobs(true)
        },

        selectSilverJobs: function() {
            if ( this.nightshiftWorker.jobPool.length === 0 ) {
                new UserMessage('Empty Job Pool', UserMessage.TYPE_ERROR).show()
                return
            }
            const max = this.nightshiftWorker.limit
            this.addedJobs = []
            const jobs = this.getAllUniqueJobs()

            for ( const job of jobs ) {
                if ( this.addedJobs.length >= max ) break
                const poolJob = this.getJobFromJobPool(job.id)

                if ( !poolJob ) continue

                if ( this.isJobSilver(job.x, job.y, job.id) ) {
                    this.addJob(job.x, job.y, job.id, poolJob.set)
                    continue
                }

                if ( poolJob.keepAnyway ) {
                    this.addJob(job.x, job.y, job.id, poolJob.set)
                }
            }
            console.log('Silver jobs swap finished at ', Now().date)
            console.log(this.addedJobs)
            this.beginRun(false)
        },

        handleLoadJobs: function(r, isReset) {
            let index = 0
            let currentLength = 0
            let maxLength = 299
            var tiles = []
            const jobs = []

            for ( let jobGroup in r.job_groups ) {
                const groupId = parseInt(jobGroup)
                let group = r.job_groups[jobGroup]
                let jobsGroup = JobList.getJobsByGroupId(groupId)

                for ( let tilecoord = 0; tilecoord < group.length; tilecoord++ ) {
                    let xCoord = Math.floor(group[tilecoord][0]/GameMap.tileSize)
                    let yCoord = Math.floor(group[tilecoord][1]/GameMap.tileSize)
                    if ( currentLength == 0 ) {
                        tiles[index] = []
                    }

                    tiles[index].push([xCoord,yCoord])
                    currentLength++

                    if ( currentLength === maxLength ) {
                        currentLength = 0
                        index++
                    }

                    for ( let i = 0; i < jobsGroup.length; i++ ) {
                        const job = new Job(group[tilecoord][0],group[tilecoord][1],jobsGroup[i].id, groupId)
                        job.setIsSilver(Vajda.isJobSilver(job.x, job.y, job.id))
                        jobs.push(job)
                    }
                }
            }
            let toLoad = tiles.length
            let loaded = 0
            for ( let blocks = 0; blocks < tiles.length; blocks++ ) {
                GameMap.Data.Loader.load(tiles[blocks], () => {
                    loaded++
                    if ( loaded === toLoad ) {
                        Vajda.jobsLoaded = true
                        Vajda.allJobs = jobs

                        if ( isReset ) {
                            Vajda.loadJobData(Vajda.selectSilverJobs.bind(Vajda))
                        } else {
                            Vajda.findAllConsumables()
                            Vajda.createWindow()
                        }

                    }
                })
            }
        },

        getJobSet: function(x, y, id) {
            const job = this.findAddedJob(x, y, id)
            if ( job !== null )
                return job.set
        },

        setJobSet: function(x,y,id,set) {
            const job = this.findAddedJob(x, y, id)
            if ( job !== null)
                return job.setSet(set)
        },

        findAddedJob: function(x, y, id) {
            for ( const job of this.addedJobs ) {
                if ( job.x === x && job.y === y && job.id === id ) {
                    return job
                }
            }
            return null
        },

        setDates: function() {
            const swapTime = Now()
            const [hours, minutes] = this.nightshiftWorker.swapTime.split(':').map(t => Number(t))
            if ( swapTime.date.getHours() >= hours && swapTime.date.getMinutes() >= minutes ) {
                swapTime.date.setDate(swapTime.date.getDate() + 1)
            }

            swapTime.date.setHours(hours, minutes, 0, 0)
            this.swapTime = swapTime
        },

        checkJobSwapSchedule: async function() {
            if ( !this.nightshiftWorker?.isEnabled ) return Promise.resolve(false)

            if ( Now().getTime() < this.swapTime.getTime() ) {
                return Promise.resolve(false)
            }

            this.currentState = 4
            this.finishRun(false)
            await sleep(30000)
            this.initSessionReload()
            return Promise.resolve(true)
        },

        beginRun: async function(isHumanAction = true) {
            Vajda.setDates()
            const parseSuccesful = isHumanAction ? Vajda.parseStopMotivation() : true
            if ( parseSuccesful ) {
                Vajda.currentState = 3
                $(`#vajda-state-info`).text(`Current state: ${Vajda.states[3]}`)
                Vajda.createRoute()
                Vajda.isRunning = true
                Vajda.setCookies()
                if ( Manager.isOptimized && Manager.hasEnoughPlugsAndDecorations() ) {
                    await Manager.createSchedule()
                }
                Observer.start()
                Vajda.run()
            } else {
                new UserMessage("Wrong format of set stop motivation", UserMessage.TYPE_ERROR).show()
            }
        },

        finishRun: function(isRequiredAlert = true) {
            this.currentState = 0
            this.isRunning = false
            this.selectTab("chosenJobs")
            if ( isRequiredAlert ) {
                alert("Finished")
            }
        },

        updateJobDistances: function() {
            for ( let i = 0; i < this.allJobs.length; i++ ) {
                this.allJobs[i].calculateDistance()
            }
        },

        findJobData: function(job) {
            for ( let i = 0 ;i < JobsModel.Jobs.length; i++ ) {
                if ( JobsModel.Jobs[i].id === job.id ) {
                    return JobsModel.Jobs[i]
                }
            }
        },

        findJob: function(x, y, id, set = -1) {
            const job = this.allJobs.find(j => j.id === id && j.x === x && j.y === y)
            job?.setSet(set)
            return job
        },

        addJob: function(x, y, id, set) {
            let job = null
            if ( !this.checkIfJobAdded(id) ) {
                job = this.findJob(x, y, id, set)
                if ( job )
                    this.addedJobs.push(job)
            }

            if ( this.addedJobs.length > 1 ) {
                this.noMotivationJob = null
            }

            return job
        },

        removeJob: function(x, y, id) {
            for ( let i = 0; i < this.addedJobs.length; i++ ) {
                if ( this.addedJobs[i].id === id && this.addedJobs[i].x === x && this.addedJobs[i].y === y) {
                    this.addedJobs.splice(i,1)
                    this.consolidePosition(i)
                    break
                }
            }

            if ( this.addedJobs.length === 0 ) {
                this.noMotivationJob = null
            }
        },

        parseJobData: function(jobs) {
            for ( let job = 0; job < jobs.length; job++ ) {
                let currentJob = jobs[job]
                let data = this.findJobData(currentJob)
                let xp = data.basis.short.experience
                let money = data.basis.short.money
                currentJob.setMotivation(data.jobmotivation*100)
                if ( currentJob.isSilver ) {
                    xp = Math.ceil(1.5*xp)
                    money = Math.ceil(1.5*money)
                }
                currentJob.setExperience(xp)
                currentJob.setMoney(money)
            }
        },

        getJobName: function(id) {
            return JobList.getJobById(id).name
        },

        checkIfJobAdded: function(id) {
            for ( const job of this.addedJobs ) {
                if ( job.id === id ) {
                    return true
                }
            }

            return false
        },

        isJobSilver: function(x, y, id) {
            const key = `${x}-${y}`
            const jobData = GameMap.JobHandler.Featured[key]
            if ( jobData === undefined || jobData[id] === undefined ) {
                return false
            } else {
                return jobData[id].silver
            }
        },

        compareUniqueJobs: function(job, jobs){
            for ( let i = 0 ; i < jobs.length; i++ ) {
                if ( jobs[i].id === job.id ) {
                    if ( job.isSilver && !jobs[i].isSilver || (job.isSilver === jobs[i].isSilver && job.distance < jobs[i].distance) ) {
                        const j = jobs.at(i)
                        if ( !this.isJobSilver(j.x, j.y, j.id) )
                            jobs.splice(i,1)
                        jobs.push(job)
                    }
                    return
                }
            }
            jobs.push(job)
        },

        getAllUniqueJobs: function() {
            this.updateJobDistances()
            let jobs = []
            for ( let i = 0 ; i < this.allJobs.length; i++ ) {
                const currentJob = this.allJobs.at(i)
                if ( this.jobFilter.filterJob !== "" ) {
                    if ( !this.getJobName(currentJob.id).toLowerCase().includes(this.jobFilter.filterJob)) {
                        continue
                    }
                }

                if ( this.checkIfJobAdded(currentJob.id) ) {
                    continue
                }

                let isSilver = this.isJobSilver(currentJob.x, currentJob.y, currentJob.id)
                currentJob.isSilver = isSilver
                currentJob.calculateDistance()

                if ( isSilver && this.jobFilter.filterNoSilver ) {
                    continue
                }

                if ( !isSilver && this.jobFilter.filterOnlySilver ) {
                    continue
                }

                if ( this.jobFilter.filterCenterJobs && currentJob.id < 131 ) {
                    continue
                }

                this.compareUniqueJobs(currentJob, jobs)
            }

            this.parseJobData(jobs)

            let experienceSort = function(a, b) {
                if ( a === null && b === null ) {
                    return 0
                }

                if ( a === null && b !== null ) {
                    return 1
                }

                if ( a !== null && b === null ) {
                    return -1
                }

                let a1 = a.experience
                let b1 = b.experience
                return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0
            }

            let reverseExperienceSort = function(a, b) {
                if ( a === null && b === null ) {
                        return 0
                }
                if ( a === null && b !== null ) {
                    return -1
                }

                if ( a !== null && b === null ) {
                    return 1
                }

                let a1 = a.experience
                let b1 = b.experience
                return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0
            }

            let distanceSort = function(a, b) {
                if ( a === null && b === null ) {
                    return 0
                }

                if ( a === null && b !== null ) {
                    return 1
                }

                if ( a !== null && b === null ) {
                    return -1
                }

                let a1 = a.distance
                let b1 = b.distance
                return (a1 > b1) ? -1 :(a1 < b1) ? 1 :0
            }

            let reverseDistanceSort = function(a, b) {
                if ( a === null && b === null ) {
                    return 0
                }

                if ( a === null && b !== null ) {
                    return -1
                }

                if(a !== null && b === null ) {
                    return 1
                }

                let a1 = a.distance
                let b1 = b.distance
                return (a1 > b1) ? 1 :(a1 < b1) ? -1 :0
            }

            if ( this.sortJobTableXp === 1 ) {
                jobs.sort(experienceSort)
            }

            if ( this.sortJobTableXp === -1 ) {
                jobs.sort(reverseExperienceSort)
            }

            if ( this.sortJobTableDistance === 1 ) {
                jobs.sort(distanceSort)
            }

            if ( this.sortJobTableDistance === -1 ) {
                jobs.sort(reverseDistanceSort)
            }

            return jobs
        },

        resetTab(tabId) {
            switch(tabId) {
                case 'jobs':
                    this.nightshiftWorker = {
                        isEnabled: false,
                        jobPool: [],
                        defaultSet: -1
                    }
                    this.selectTab('jobs')
                    break
                case 'chosenJobs':
                    this.addedJobs.forEach(j => j.setSet(-1))
                    this.selectTab('chosenJobs')
                    break
                case 'jobPool':
                    this.nightshiftWorker = {
                        isEnabled: false,
                        jobPool: [],
                        defaultSet: -1
                    }
                    this.selectTab('jobPool')
                    break
                case 'sets':
                    this.healthSet = -1
                    this.jobSet = -1
                    this.speedSet = -1
                    this.selectedSet = -1
                    this.loadSets()
                    this.selectTab('sets')
                    break
                case 'settings':
                    this.nightshiftWorker = {
                        isEnabled: false,
                        jobPool: [],
                        defaultSet: -1,
                        swapTime: '3:00',
                        limit: 17
                    }
                    this.settings = {
                        addEnergy: false,
                        addMotivation: false,
                        addHealth: false,
                        minHP: 1000,
                        setWearDelay: 5,
                        jobDelayMin: 0,
                        jobDelayMax: 0,
                        addDeposit: {
                            isEnabled: false,
                            limit: NaN
                        },
                        rememberSelection: {
                            consumables: false,
                            travelBuff: false,
                            characterBuff: false
                        }
                    }
                    this.selectTab('settings')
            }
        },

        getConsumableIcon: function(src) {
            return `<div><img src='${src}' alt=''></div>`
        },

        getItemImage: function(id) {
            return ItemManager.get(id).wear_image
        },

        createComboxJobSets: function(x, y, id) {
            const combobox = new west.gui.Combobox()
            this.addComboboxItems(combobox)
            combobox.select(this.getJobSet(x, y, id))
            combobox.setWidth(60)
            combobox.addListener((value) => {
                this.setJobSet(x, y, id, value)
            })
            return combobox.getMainDiv()
        },

        addComboboxItems: function(combobox, defaultLabel = 'None') {
            combobox.addItem(-1, defaultLabel)
            for ( let i = 0 ; i < this.sets.length; i++) {
                combobox.addItem(i, this.sets[i].name)
            }
        },

        createAddJobButton: function(x, y, id) {
            const buttonAdd = new west.gui.Button("Add new job", function() {
                Vajda.addJob(x, y, id)
                Vajda.jobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
                Vajda.jobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
                Vajda.selectTab("jobs")
            })
            buttonAdd.setWidth(100)
            return buttonAdd.getMainDiv()
        },

        createTextfield: function(value, callback, width) {
            const textfield = new west.gui.Textfield()
            textfield.setValue(value)
            textfield.getMainDiv().find('input').change(callback)

            if ( width ) {
                textfield.setWidth(width)
            }

            return textfield.getMainDiv()
        },

        createCheckbox: function(label, isSelected, callback) {
            const checkbox = new west.gui.Checkbox()
            checkbox.setLabel(label)
            checkbox.setSelected(isSelected)
            checkbox.setCallback(callback)
            return checkbox.getMainDiv()
        },

        getJobFromJobPool: function(jobId) {
            return this.nightshiftWorker?.jobPool.find(j => j.id === jobId)
        },

        createErrorTab: function(tabId) {
            const resetButton = new west.gui.Button('Fix Errors', () => Vajda.resetTab(tabId))
            resetButton.getMainDiv().style.justifySelf = 'center'

            const style = `'
                position: absolute;
                inset: 0;
                display: grid;
                align-content: center;
                justify-content: center;
                gap: 1rem;
                padding-bottom: 5rem
            '`

            const html = $(`
                <div style=${style}>
                    <h1 style='text-align: center'>OOOPS</h1>
                    <p>Seems like something's gone to shieeet. Check your settings and make sure everything's alright.</p>
                </div>
            `)

            html.append(resetButton.getMainDiv())

            return html
        },

        createAddToJobsPoolButton: function(jobId) {
            if ( this.getJobFromJobPool(jobId) ) {
                return null
            }

            const addToPool = () => {
                this.nightshiftWorker.jobPool.push(new JobPoolJob(jobId))
                Vajda.jobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
                Vajda.jobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
                Vajda.selectTab("jobs")
            }
            const button = new west.gui.Button("Add To Job Pool", addToPool)
            button.getMainDiv().style.marginBottom = '2px'
            return button.getMainDiv()
        },

        parseStopMotivation: function() {
            for ( let i = 0; i < this.addedJobs.length; i++ ) {
                let stopMotivation = $(".vajda-window #x-" + this.addedJobs[i].x + "y-" + this.addedJobs[i].y + "id-" + this.addedJobs[i].id).prop("value")
                if ( this.isNumber(stopMotivation) ) {
                    this.addedJobs[i].setStopMotivation(parseInt(stopMotivation))
                } else {
                    return false
                }
            }
            return true
        },

        getJobIcon: function(isSilver, id, x, y) {
            return `
                <div class="job" style="left: 0; top: 0; position: relative;">
                    <div onclick="JobWindow.open(${id}, ${x}, ${y})" class="featured ${isSilver && 'silver'}"></div>
                    <div class='centermap' onclick='GameMap.center(${x}, ${y})' style="position: absolute; background-image: url('../images/map/icons/instantwork.png'); width: 20px; height: 20px; top: 0; right: 3px; cursor: pointer"></div>
                    <img src="../images/jobs/${JobList.getJobById(id).shortname}.png" class="job_icon" alt='job_image'>
                </div>
            `
        },

        getJobPoolJobIcon: function(jobId, index) {
            let isOpen = false
            const html = $(`
                <div style='display: inline-grid; grid-template-columns: 1fr 0; overflow: hidden; padding: 5px'>
                    <div class='job' style='padding: 10px; position: relative'>
                        <img src='../images/jobs/${JobList.getJobById(jobId).shortname}.png' class='job_icon' alt='job_image'>
                        <svg class='bin-icon' style='position: absolute; top: 5px; right: 5px; width: 15px; transition: opacity .2s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" fill='rgb(210, 0, 0)'/></svg>
                        <svg class='gear-icon' style='position: absolute; bottom: 5px; right: 5px; width: 15px; transition: opacity .2s' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                    </div>
                    <div class='options' style='min-width: 100px; overflow: hidden; display: grid; padding: .5rem 1rem; background-color: rgba(255, 255, 228, .3); border-radius: 5px; box-shadow: 0 0 5px rgba(0, 0, 0, .2); margin-left: 8px'>
                        <div class='set'>
                            Set for this job:
                        </div>
                    </div>
                </div>
            `)
            const setsCombobox = new west.gui.Combobox()
            this.addComboboxItems(setsCombobox, 'Default')
            const selectedSet = this.nightshiftWorker.jobPool.at(index)._set
            setsCombobox.select(selectedSet)
            setsCombobox.setWidth(60)
            setsCombobox.addListener(val => {
                this.nightshiftWorker.jobPool.at(index).set = val
            })

            const keepJobCheckbox = new west.gui.Checkbox()
            keepJobCheckbox.setLabel('Keep job even if not silver')
            keepJobCheckbox.setSelected(this.nightshiftWorker.jobPool.at(index).keepAnyway)
            keepJobCheckbox.setCallback(val => {
                this.nightshiftWorker.jobPool.at(index).keepAnyway = val
            })

            html.find(`.bin-icon`).click( () => {
                this.nightshiftWorker.jobPool.splice(index, 1)
                this.selectTab(`jobPool`)
            })

            html.find('.bin-icon').hover(function() {
                    $(this).css('opacity', '.5')
                },
                function() {
                    $(this).css('opacity', '1')
                }
            )

            html.find('.gear-icon').hover(function() {
                    $(this).css('opacity', '.7')
                },
                function() {
                    $(this).css('opacity', '1')
                }
            )

            html.find('.gear-icon').click(() => {
                isOpen = !isOpen
                html.css('grid-template-columns', isOpen ? '1fr auto' : '1fr 0')
            })

            html.find(`.options .set`).append(setsCombobox.getMainDiv())
            html.find('.options').append(keepJobCheckbox.getMainDiv())
            return html
        },

        createJobsPoolGui: function() {
            const html = $(`
                <div style='height: 400px; overflow-y: auto'>
                    <div id='set-selection' style='padding-bottom: 1rem; display: flex; align-items: center; justify-content: center; gap: 1rem'>
                        <strong>Select default set for these jobs: </strong>
                    </div>

                    <div id='pool'></div>
                </div>`
            )

            const setsCombobox = new west.gui.Combobox()
            this.addComboboxItems(setsCombobox)
            setsCombobox.setWidth(60)
            setsCombobox.select(this.nightshiftWorker.defaultSet)
            setsCombobox.addListener(val => {
                this.nightshiftWorker.defaultSet = val
            })

            html.find('#set-selection').append(setsCombobox.getMainDiv())
            const pool = html.find('#pool')
            this.nightshiftWorker.jobPool.forEach((j, i) => pool.append(this.getJobPoolJobIcon(j.id, i)))

            return html
        }
    }

    Vajda.setSetForAllJobs = function() {
        for ( let i = 0; i < Vajda.addedJobs.length; i++ ) {
            Vajda.addedJobs[i].setSet(Vajda.jobSet)
        }
    }

    Vajda.consolidePosition = function(removeIndex) {
        if ( removeIndex <= Vajda.currentJob.job && Vajda.currentJob.job > 0 ) {
            Vajda.currentJob.job--
        }
        if ( Vajda.addedJobs.length === 1 ) {
            Vajda.currentJob.direction = true
        }
    }

    Vajda.createDistanceMatrix = function() {
        const matrix = new Array(Vajda.addedJobs.length)

        for ( let i = 0; i < matrix.length; i++ ) {
            matrix[i] = Vajda.addedJobs[i].calculateJobDistances()
        }

        return matrix
    }

    Vajda.countSetBits = function(n) {
        let count = 0
        while (n) {
            n &= n - 1
            count++
        }
        return count
    }

    Vajda.heldKarpSymmetric = function(distances, startJob) {
        const n = distances.length
        const memo = Array(1 << n).fill().map(() => Array(n).fill({ cost: Infinity, path: [] }))
        memo[1 << startJob][startJob] = { cost: 0, path: [startJob] }

        for ( let subsetSize = 2; subsetSize <= n; subsetSize++ ) {
            for ( let subset = 0; subset < (1 << n); subset++ ) {
                if ( Vajda.countSetBits(subset) === subsetSize && (subset & (1 << startJob)) ) {
                    for ( let end = 0; end < n; end++ ) {
                        if ( (subset & (1 << end)) !== 0 ) {
                            for ( let prevEnd = 0; prevEnd < n; prevEnd++ ) {
                                if ( prevEnd !== end && (subset & (1 << prevEnd)) !== 0 ) {
                                    const newCost = memo[subset ^ (1 << end)][prevEnd].cost + distances[prevEnd][end]
                                    if (newCost < memo[subset][end].cost) {
                                        memo[subset][end] = { cost: newCost, path: memo[subset ^ (1 << end)][prevEnd].path.concat([end]) }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        let minCost = Infinity
        let minPath = []
        for ( let end = 0; end < n; end++ ) {
            if ( end !== startJob && memo[(1 << n) - 1][end].cost < minCost ) {
                minCost = memo[(1 << n) - 1][end].cost
                minPath = memo[(1 << n) - 1][end].path
            }
        }

        return { cost: minCost, path: minPath }
    }


    Vajda.setEntryPoint = function(route) {
        const firstJob = route.at(0)
        const lastJob = route.at(-1)

        if ( firstJob.calculateDistance() > lastJob.calculateDistance() )
            route.reverse()

        //i could in theory make vajda start with the job nearest to current character position but cba
    }

    Vajda.getOptimalRoute = function(distanceMatrix) {
        const jobsCount = distanceMatrix.length

        if ( jobsCount === 1 )
            return {
                cost: 0,
                path: [0]
            }

        const routes = []
        for ( let startJob = 0; startJob < jobsCount; startJob++ ) {
            const { cost, path } = Vajda.heldKarpSymmetric(distanceMatrix, startJob)
            routes.push({ cost, path })
        }

        return routes.reduce(function(prev, curr) {
            return prev.cost < curr.cost ? prev : curr
        })
    }

    Vajda.createRoute = function() {
        Vajda.currentJob = {
            job: 0,
            direction: true
        }

        const distanceMatrix = Vajda.createDistanceMatrix()
        const optimalRoute = Vajda.getOptimalRoute(distanceMatrix)

        const addedJobsOrder = []
        for ( const index of optimalRoute.path ) {
            addedJobsOrder.push(Vajda.addedJobs.at(index))
        }

        Vajda.setEntryPoint(addedJobsOrder)

        Vajda.addedJobs = addedJobsOrder
        Vajda.selectTab("chosenJobs")
    }

    Vajda.createSetGui = function() {
        if ( Vajda.sets.length === 0 ) {
            return $(`<span style='font-size: 20px'>No sets available</span>`)
        }
        let htmlSkel = $(`
            <div id='vajda_sets_window' style='display: block; position: relative; width: 650px; height:430px'>
                <div id='vajda_sets_left' style='display: block; position: absolute; width: 250px; height: 430px; top:0px; left:0px'></div>
                <div id='vajda_sets_right' style='display: block; position: absolute; width:300px; height: 410px; top: 0px; left: 325px'></div>
            </div>`)
        let combobox = new west.gui.Combobox("combobox_sets")
        Vajda.addComboboxItems(combobox)
        combobox = combobox.select(Vajda.selectedSet)
        combobox.addListener(function(value) {
            Vajda.selectedSet = value
            Vajda.selectTab("sets")
        })
        let buttonSelectTravelSet = new west.gui.Button("Select travel set", function() {
            Vajda.travelSet = Vajda.selectedSet
            Vajda.selectTab("sets")
        })
        let buttonSelectJobSet = new west.gui.Button("Select job set", function() {
            Vajda.jobSet = Vajda.selectedSet
            Vajda.setSetForAllJobs()
            Vajda.selectTab("sets")
        })
        let buttonSelectHealthSet = new west.gui.Button("Select health set", function() {
            Vajda.healthSet = Vajda.selectedSet
            Vajda.selectTab("sets")
        })

        let travelSetText = "None"

        if ( Vajda.travelSet != -1 ) {
            travelSetText = Vajda.sets[Vajda.travelSet].name
        }

        let jobSetText = "None"
        if ( Vajda.jobSet != -1 ) {
            jobSetText = Vajda.sets[Vajda.jobSet].name
        }

        let healthSetText = "None"
        if ( Vajda.healthSet != -1 ) {
            healthSetText = Vajda.sets[Vajda.healthSet].name
        }

        let regenSetText = "None"
        if ( Vajda.regenerationSet != -1 ) {
            regenSetText = Vajda.sets[Vajda.regenerationSet].name
        }

        const left = $("<div></div>")
            .append(
                new west.gui.Groupframe()
                .appendToContentPane($("<span>Sets</span><br><br>"))
                .appendToContentPane(combobox.getMainDiv())
                .appendToContentPane($("<br><br><span>Travel set:"+ travelSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectTravelSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Job set:"+ jobSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectJobSet.getMainDiv())
                .appendToContentPane($("<br><br><span>Health set:"+ healthSetText +"</span><br><br>"))
                .appendToContentPane(buttonSelectHealthSet.getMainDiv())
                .getMainDiv()
            )
         const right = $("<div style=\'display:block; position:relative; width:300px; height:410px'\></div>")
        //head div
        right.append("<div class=\'wear_head wear_slot'\ style=\'display:block; position:absolute; left:30px; top:1px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position: -95px 0'\></div>")
        //chest div
        right.append("<div class=\'wear_body wear_slot'\ style=\'display:block; position:absolute; left:30px; top:106px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //pants div
        right.append("<div class=\'wear_pants wear_slot'\ style=\'display:block; position:absolute; left:30px; top:258px; width:93px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //neck div
        right.append("<div class=\'wear_neck wear_slot'\ style=\'display:block; position:absolute; left:-47px; top:1px; width:74px; height:74px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-189px 0'\></div>")
        //right arm div
        right.append("<div class=\'wear_right_arm wear_slot'\ style=\'display:block; position:absolute; left:-64px; top:79px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //animal div
        right.append("<div class=\'wear_animal wear_slot'\ style=\'display:block; position:absolute; left:-64px; top:223px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        //yield div
        right.append("<div class=\'wear_yield wear_slot'\ style=\'display:block; position:absolute; left:-47px; top:321px; width:74px; height:74px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-189px 0'\></div>")
        //left arm div
        right.append("<div class=\'wear_left_arm wear_slot'\ style=\'display:block; position:absolute; left:127px; top:52px; width:95px; height:138px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:0 0'\></div>")
        //belt div
        right.append("<div class=\'wear_belt wear_slot'\ style=\'display:block; position:absolute; left:127px; top:200px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        //boots div
        right.append("<div class=\'wear_foot wear_slot'\ style=\'display:block; position:absolute; left:127px; top:302px; width:93px; height:94px; background:url(https://westzz.innogamescdn.com/images/window/wear/bg_sprite.png) 0 0 no-repeat; background-position:-95px 0'\></div>")
        let keys = ["head","body","pants","neck","right_arm","animal","yield","left_arm","belt","foot"]
        if ( Vajda.selectedSet !== -1 )
            Vajda.insertSetImages(right,keys)
        $("#vajda_sets_left",htmlSkel).append(left)
        $("#vajda_sets_right",htmlSkel).append(right)
        return htmlSkel
    }

    Vajda.getImageSkel = function() {
        return $("<img src=\''\>")
    }

    Vajda.insertSetImages = function(html,keys) {
        for ( let i = 0; i < keys.length; i++ ) {
            if ( Vajda.sets[Vajda.selectedSet][keys[i]] !== null ) {
                $(".wear_"+keys[i], html).append(Vajda.getImageSkel().attr("src", Vajda.getItemImage(Vajda.sets[Vajda.selectedSet][keys[i]])))
            }
        }
        return html
    }

    Vajda.addEventsHeader = function() {
        $(".vajda-window .jobXp").click(function() {
            if ( Vajda.sortJobTableXp === 0 ) {
                Vajda.sortJobTableXp = 1
            } else {
                ( Vajda.sortJobTableXp === 1 ) ? Vajda.sortJobTableXp = -1 : Vajda.sortJobTableXp = 1
            }
            Vajda.sortJobTableDistance = 0
            Vajda.selectTab("jobs")
        })
        $(".vajda-window .jobDistance").click(function() {
            if ( Vajda.sortJobTableDistance === 0 ) {
                Vajda.sortJobTableDistance = 1
            } else {
                ( Vajda.sortJobTableDistance === 1 ) ? Vajda.sortJobTableDistance = -1 : Vajda.sortJobTableDistance = 1
            }
            Vajda.sortJobTableXp = 0
            Vajda.selectTab("jobs")
        })
    }

    Vajda.isInHomeTown = function() {
        const homeTown = Character.homeTown
        return GameMap.calcWayTime(Character.position,{x: homeTown.x, y: homeTown.y}) == 0
    }

    Vajda.addDeposit = async function(townId) {
        const amount = Character.money
        await Ajax.remoteCall("building_bank", "deposit", {
            town_id: townId,
            amount: amount
        }, function(data) {
            if (data.error == false) {
                BankWindow.Balance.Mupdate(data)
                Character.setDeposit(data.deposit)
                Character.setMoney(data.own_money)
            } else
                new UserMessage(data.msg,UserMessage.TYPE_ERROR).show()
        }, BankWindow)
    }


    Vajda.goDepositMoney = async function() {
        const townId = Character.homeTown.town_id
        if ( !townId ) return

        await Vajda.equipSet(Vajda.travelSet)
        TaskQueue.add(new TaskWalk(townId, 'town'))

        while(true) {
            if ( Vajda.isInHomeTown() ) {
                break
            }

            if( !Vajda.isRunning ) {
                break
            }

            await sleep(1000)
        }

        await Vajda.addDeposit(townId)
        $('.tw2gui_dialog_framefix').remove()
    }

    Vajda.updateJobsMotivationOnRefill = function(val) {
        return Vajda.addedJobs.map(job => job.setMotivation(p => p + val).motivation - job.stopMotivation)
    }


    Vajda.checkMotivation = async function(index, result, callback) {
        let check = function(index, result) {
            Vajda.loadJobMotivation(index, function(motivation) {
                Vajda.addedJobs.at(index).setMotivation(motivation)
                result.push(motivation)
                if ( index + 1 < Vajda.addedJobs.length ) {
                    check(++index, result)
                } else if( index + 1 === Vajda.addedJobs.length ) {
                    callback(result)
                    return
                }
            })
        }
        check(index, result)
    }

    Vajda.isMotivationAbove = function(result) {
        for ( let i = 0; i < result.length; i++ ) {
            if ( result.at(i) > Vajda.addedJobs.at(i).stopMotivation ) {
                return true
            }
        }
        return false
    }

    Vajda.isStopMotivationZero = function() {
        for ( let i = 0; i < Vajda.addedJobs.length; i++ ) {
            if( Vajda.addedJobs[i].stopMotivation === 0 ) {
                return true
            }
        }
        return false
    }

    Vajda.isHealthBelowLimit = function() {
        if ( Vajda.settings.minHP >= Character.health ) {
            return true
        }
        return false
    }

    Vajda.isWastingMotivation = function() {
        if ( this.noMotivationJob?.motivation === 0 ) {
            this.noMotivationJob = null
        }

        return this.noMotivationJob?.spendMotivation
    }

    Vajda.changeJob = function() {
        Vajda.currentJob.direction ? Vajda.currentJob.job++ : Vajda.currentJob.job--;
        if ( Vajda.currentJob.job === Vajda.addedJobs.length ) {
            Vajda.currentJob.job--
            Vajda.currentJob.direction = false
        } else if ( Vajda.currentJob.job < 0 ) {
            Vajda.currentJob.job++
            Vajda.currentJob.direction = true
        }
        Vajda.setCookies()
        Vajda.run()
    }

    Vajda.searchBest = function(skills, jobId, onlyWearable = true) {
        if (!Bag.loaded) {
            EventHandler.listen('inventory_loaded', function() {
                Vajda.searchBest(skills, jobId, onlyWearable)
                return EventHandler.ONE_TIME_EVENT
            })
            return
        }
        let set = west.item.Calculator.getBestSet(skills, jobId), items = set && set.getItems() || [], invItems = Bag.getItemsByItemIds(items), result = [], i, invItem, wearItem
        for (i = 0; i < invItems.length; i++) {
            invItem = invItems[i]
            wearItem = Wear.get(invItem.getType())
            if (!wearItem || (wearItem && (wearItem.getItemBaseId() !== invItem.getItemBaseId() || wearItem.getItemLevel() < invItem.getItemLevel()))) {
                result.push(invItem)
            }
        }
        return result.map(item => item.obj.getId())
    }

    Vajda.getBestGear = function(jobid) {
        let modelId = function(jobid) {
            for ( let i = 0; i < JobsModel.Jobs.length; i++ ) {
                if ( JobsModel.Jobs[i].id === jobid )
                    return i
            }
            return -1
        }
        const result = west.item.Calculator.getBestSet(JobsModel.Jobs[modelId(jobid)].get('skills'), jobid)
        const bestItems = result && result.getItems()
        return bestItems
    }

    Vajda.isWearing = function(itemId) {
        if ( Wear.wear[ItemManager.get(itemId).type] === undefined) return false
        return Wear.wear[ItemManager.get(itemId).type].obj.item_id == itemId
    }

    Vajda.isGearEquiped = function(items) {
        for ( const itemId of items ) {
            if ( !Vajda.isWearing(itemId) ) {
                return false
            }
        }

        return true
    }

    Vajda.equipBestGear = async function(job) {
        const bestGear = job.getBestEquipment()

        for ( const itemId of bestGear ) {
            Wear.carry(Bag.getItemByItemId(itemId))
        }

        setTimeout(() => {
            if ( !Vajda.isGearEquiped(bestGear) && !Vajda.isGearEquiped(Vajda.getSetItemArray(Vajda.sets[job.set])) ) {
                Vajda.equipBestGear(job)
            }
        }, 10000)

        while (true) {
            const isFinished = Vajda.isGearEquiped(bestGear)
            if ( isFinished ) break
            await sleep(50)
        }
        return Promise.resolve(true)
    }

    Vajda.getSetItemArray = function(set) {
        var items = []
        if ( set.head !== null )
            items.push(set.head)
        if ( set.neck !== null )
            items.push(set.neck)
        if ( set.body !== null )
            items.push(set.body)
        if ( set.right_arm !== null )
            items.push(set.right_arm)
        if ( set.left_arm !== null )
            items.push(set.left_arm)
        if ( set.belt !== null )
            items.push(set.belt)
        if ( set.foot !== null )
            items.push(set.foot)
        if ( set.animal !== null )
            items.push(set.animal)
        if ( set.yield !== null )
            items.push(set.yield)
        if ( set.pants !== null )
            items.push(set.pants)
        return items
    }

    Vajda.equipSet = async function(set) {
        if ( set === -1 ) return true
        EquipManager.switchEquip(Vajda.sets[set].equip_manager_id)
        while ( true ) {
            let isFinished = Vajda.isGearEquiped(Vajda.getSetItemArray(Vajda.sets[set]))
            if ( isFinished ) break
            await sleep(50)
        }
        return Promise.resolve(true)
    }

    Vajda.cancelJobs = function() {
        if ( TaskQueue.queue.length > 0 )
            TaskQueue.cancelAll()
    }


    //https://prnt.sc/KAgbLNqB4zK6
    Vajda.runJob = async function(jobIndex, jobCount) {
        this.statistics.sessionJobsCount += jobCount
        this.statistics.totalJobsCount += jobCount
        const oldXp = Character.experience
        const oldMoney = Character.money
        const job = this.isWastingMotivation() ? this.noMotivationJob : this.addedJobs.at(jobIndex)
        await this.equipBestGear(job)
        for ( let i = 0; i < jobCount; i++ ) {
            JobWindow.startJob(job.id, job.x, job.y, 15)
        }
        Observer.start()
        await sleep(this.settings.setWearDelay * 1000)
        this.equipSet(job.set)
        Manager.useBuff('character')
        while (true) {
            if ( TaskQueue.queue.length === 0 ) {
                this.updateStatistics(oldXp, oldMoney)
                this.setCookies()
                this.prepareJobRun(jobIndex)
                return
            }
            if ( !this.isRunning || this.isHealthBelowLimit() ) {
                break
            }
            await sleep(1000)
        }
        this.statistics.sessionJobsCount -= TaskQueue.queue.length
        this.statistics.totalJobsCount -= TaskQueue.queue.length
        this.updateStatistics(oldXp, oldMoney)
        this.setCookies()
        this.cancelJobs()

        if ( this.isRunning && this.isHealthBelowLimit() ) {
            await sleep(2000)
            this.run()

        }
    }

    Vajda.walkToJob = async function(index) {
        const job = this.isWastingMotivation() ? this.noMotivationJob : this.addedJobs.at(index)
        const jobToWalkTo = job.getJobToWalkTo()

        await Manager.useBuff('travel')

        if ( Vajda.isAllowedToDepositMoney() ) {
            Observer.start()
            await Vajda.goDepositMoney()
        }

        JobWindow.startJob(jobToWalkTo.id, job.x, job.y, 15)
        Observer.start()

        while (true) {
            if ( GameMap.calcWayTime(Character.position, {x: job.x, y: job.y} ) === 0 ) {
                break
            }

            if ( !Vajda.isRunning ) {
                break
            }
            await sleep(1000)
        }
        Vajda.cancelJobs()
        Vajda.noMotivationJob?.spendMotivation && await sleep(4000)
        if ( Vajda.isRunning )
            Vajda.prepareJobRun(index)
    }

    Vajda.prepareJobRun = function(index) {
        const job = this.isWastingMotivation() ? this.noMotivationJob :  this.addedJobs.at(index)
        setTimeout(function() {
            Vajda.loadJobMotivation(index, async function(motivation) {
                Vajda.addedJobs.at(index).setMotivation(motivation)
                if ( Character.energy === 0 || Vajda.isHealthBelowLimit() ) {
                    Vajda.run()
                }   else if ( motivation <= job.stopMotivation && job.stopMotivation > 0 ) {
                    Vajda.checkMotivation(0, [], function(result) {
                        if ( Vajda.isMotivationAbove(result) ) {
                            Vajda.changeJob()
                        } else {
                            Vajda.run()
                        }
                    })
                } else if ( GameMap.calcWayTime(Character.position,{x: job.x, y: job.y}) === 0 ) {
                    let maxJobs = Premium.hasBonus('automation') ? 9 : 4
                    let numberOfJobs
                    if (job.stopMotivation !== 0 ) {
                        numberOfJobs = Math.min(Math.min(motivation - job.stopMotivation, Character.energy), maxJobs)
                    } else {
                        numberOfJobs = Math.min(Character.energy, maxJobs)
                    }

                    Vajda.runJob(index, Math.floor(numberOfJobs))
                    if ( Manager.isOptimized )
                        Manager.checkSchedule(numberOfJobs)
                } else {
                    await Vajda.equipSet(Vajda.travelSet)
                    Vajda.walkToJob(index)
                }
            })
        }, Vajda.RNG(Vajda.settings.jobDelayMin, Vajda.settings.jobDelayMax) * 1000)
    }

    Vajda.canAddMissing = function(result) {
        if ( !Vajda.settings.addMotivation && Vajda.jobsBelowMotivation(result) && !Vajda.isStopMotivationZero() ) {
            alert("Can't continue because of motivation")
            return false
        }

        if ( !Vajda.settings.addEnergy && Character.energy === 0 ) {
            alert("Can't continue because of energy")
            return false
        }

        if ( !Vajda.settings.addHealth && Vajda.isHealthBelowLimit() ) {
            alert("Can't continue because of health")
            return false
        }
        return true
    }


    Vajda.jobsBelowMotivation = function(result) {
        let count = 0
        for ( let i = 0; i < result.length; i++ ) {
            if ( result[i] <= Vajda.addedJobs.at(i).stopMotivation && Vajda.addedJobs.at(i).stopMotivation !== 0 ) {
                count++
            }
        }
        return count
    }



    Vajda.averageMissingMotivation = function(result) {
        let motivation = 0
        for ( let i = 0; i < result.length; i++ ) {
            motivation += 100-result[i]
        }
        return motivation/result.length
    }


    Vajda.fillUp = async function(result) {
        const energyMissing = 100 - (Character.energy/Character.maxEnergy) * 100
        const motivationMissing = Vajda.jobsBelowMotivation(result)
        const averageMotivationMissing = Vajda.averageMissingMotivation(result)

        const consumableToUse = Manager.findProperConsumable(motivationMissing, energyMissing, averageMotivationMissing)

        if ( consumableToUse === null ) return false

        await Manager.useConsumableOrWaitForCooldown(consumableToUse, true)

        if ( Manager.isOptimized && consumableToUse.isCakeDecoration() ) {
            const updatedMotivation = Vajda.updateJobsMotivationOnRefill(consumableToUse.motivation)
            await Manager.createSchedule(updatedMotivation)
        }

        return true
    }

    Vajda.updateStatistics = function(oldXp, oldMoney) {
        const xpDiff = Character.experience - oldXp
        const moneyDiff = Character.money - oldMoney

        Vajda.statistics.sessionXpCount += xpDiff
        Vajda.statistics.totalXpCount += xpDiff

        if ( moneyDiff > 0 ) {      //spending money while vajda is running would make this a bit funky
            Vajda.statistics.sessionMoneyCount += moneyDiff
            Vajda.statistics.totalMoneyCount += moneyDiff
        }
    }

    Vajda.run = async function() {
        const doSwap = await this.checkJobSwapSchedule()

        if ( !!doSwap ) {
            return
        }

        Vajda.checkMotivation(0, [], async function(result) {
            if ( ( Vajda.isMotivationAbove(result) || Vajda.isStopMotivationZero()) && Character.energy > 0 && !Vajda.isHealthBelowLimit() ) {
                Vajda.currentState = 1
                Vajda.prepareJobRun(Vajda.currentJob.job)
            } else {
                if ( !Vajda.canAddMissing(result) ) {
                    Vajda.finishRun()
                } else {
                    let answer = await Vajda.fillUp(result)
                    if ( !answer ) {
                        Vajda.finishRun()
                    }
                }
            }
        })
    }

    Vajda.formatNumber = function(number) {
        if ( typeof number === 'number' ) {
            number = String(number)
        }

        const numberString = number.replace(/[ ,]/g, '')

        let formattedNumber = ''
        for ( let i = 0; i < numberString. length; i++ ) {
            if ( i > 0 && i % 3 === 0 ) {
                formattedNumber = ' ' + formattedNumber
            }

            formattedNumber = numberString[numberString.length - 1 - i] + formattedNumber
        }

        return formattedNumber
    }

    Vajda.createConsumablesTable = function() {
        let htmlSkel = $(`<div id='consumables_overview'></div>`)
        let html = $(`
            <div class ='consumables_filter' style='position: relative'>
                <div id='energy_consumables' style='position: absolute; top: 10px; left: 15px'></div>
                <div id='motivation_consumables' style='position: absolute; top: 10px; left: 160px'></div>
                <div id='health_consumables' style='position: absolute; top: 10px; left: 320px'></div>
                <div id='buff_consumables' style='position: absolute; top: 10px; left: 460px'></div>
            </div>`
        )

        let table = new west.gui.Table()
        let consumableList = Vajda.filterConsumables(Vajda.consumableSelection.energy, Vajda.consumableSelection.motivation, Vajda.consumableSelection.health, Vajda.consumableSelection.hideBuffs)
        table.addColumn("consumIcon","consumIcon").addColumn("consumCount","consumCount").addColumn("consumEnergy","consumEnergy").addColumn("consumMotivation","consumMotivation").addColumn("consumHealth","consumHealth").addColumn("consumBuffs", "consumBuffs").addColumn("consumSelected","consumSelected")
        table.appendToCell("head","consumIcon","Image").appendToCell("head","consumCount","Count").appendToCell("head","consumEnergy","Energy").appendToCell("head","consumMotivation","Motivation").appendToCell("head","consumHealth","Health").appendToCell("head", "consumBuffs", "Buffs").appendToCell("head","consumSelected","Use")
        for ( const consumable of consumableList ) {
            const checkbox = new west.gui.Checkbox()
            checkbox.setSelected(consumable.isSelected)
            checkbox.setId(consumable.id)
            checkbox.setCallback(function() {
                Vajda.consumableTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
                Vajda.consumableTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
                if ( consumable instanceof Buff && !consumable.hasCooldown() ) {
                    Manager.selectedBuffs = consumable
                    Vajda.selectTab('consumables')
                    Vajda.setCookies()
                    return
                }
                Vajda.changeConsumableSelection(parseInt(this.divMain.attr("id")), this.isSelected())
                Vajda.selectTab("consumables")
                Vajda.setCookies()
            })
            table.appendRow().appendToCell(-1,"consumIcon", Vajda.getConsumableIcon(consumable.image)).appendToCell(-1,"consumCount",consumable.count).appendToCell(-1,"consumEnergy",consumable.energy).appendToCell(-1,"consumMotivation",consumable.motivation).appendToCell(-1,"consumHealth",consumable.health).appendToCell(-1, "consumBuffs", consumable.getBuffHTML()).appendToCell(-1,"consumSelected",checkbox.getMainDiv())
        }
        const buttonSelect = new west.gui.Button("Select all", function() {
            Vajda.changeSelectionAllConsumables(true)
            Vajda.selectTab("consumables")
            Vajda.setCookies()
        })
        const buttonDeselect = new west.gui.Button("Deselect all", function() {
            Vajda.changeSelectionAllConsumables(false)
            Vajda.selectTab("consumables")
            Vajda.setCookies()
        })
        table.appendToFooter("consumEnergy",buttonSelect.getMainDiv())
        table.appendToFooter("consumHealth",buttonDeselect.getMainDiv())
        htmlSkel.append(table.getMainDiv())
        const checkboxEnergyConsumes = new west.gui.Checkbox()
        checkboxEnergyConsumes.setLabel("Energy consumables")
        checkboxEnergyConsumes.setSelected(Vajda.consumableSelection.energy)
        checkboxEnergyConsumes.setCallback(function() {
            Vajda.consumableSelection.energy = this.isSelected()
            Vajda.selectTab("consumables")
        })
        const checkboxMotivationConsumes = new west.gui.Checkbox()
        checkboxMotivationConsumes.setLabel("Motivation consumables")
        checkboxMotivationConsumes.setSelected(this.consumableSelection.motivation)
        checkboxMotivationConsumes.setCallback(function() {
            Vajda.consumableSelection.motivation = this.isSelected()
            Vajda.selectTab("consumables")
        })
        const checkboxHealthConsumes = new west.gui.Checkbox()
        checkboxHealthConsumes.setLabel("Health consumables")
        checkboxHealthConsumes.setSelected(this.consumableSelection.health)
        checkboxHealthConsumes.setCallback(function() {
            Vajda.consumableSelection.health = this.isSelected()
            Vajda.selectTab("consumables")
        })
        const buffsFilter = new west.gui.Checkbox()
        buffsFilter.setLabel("Hide buffs")
        buffsFilter.setSelected(this.consumableSelection.hideBuffs)
        buffsFilter.setCallback(function() {
            Vajda.consumableSelection.hideBuffs = this.isSelected()
            Vajda.selectTab("consumables")
        })
        $("#energy_consumables", html).append(checkboxEnergyConsumes.getMainDiv())
        $("#motivation_consumables", html).append(checkboxMotivationConsumes.getMainDiv())
        $("#health_consumables", html).append(checkboxHealthConsumes.getMainDiv())
        $("#buff_consumables", html).append(buffsFilter.getMainDiv())
        htmlSkel.append(html)
        return htmlSkel
    }

    Vajda.createSingleJobMenu = function() {
        let currentLevel = 1
        const motivationSpendCheckbox = new west.gui.Checkbox()
        motivationSpendCheckbox.setLabel('Enable Farming Assistant')
        motivationSpendCheckbox.setSelected(Vajda.noMotivationJob !== null && Vajda.noMotivationJob.spendMotivation)
        motivationSpendCheckbox.setCallback(() => {
            if ( Vajda.noMotivationJob === null && Vajda.addedJobs.length === 1 ) {
                const job = Vajda.addedJobs.at(0)
                Vajda.noMotivationJob = new MotivationJob(job.getNearestNonSilver())
                Vajda.noMotivationJob.html = html
            }

            if ( Vajda.noMotivationJob ) Vajda.noMotivationJob.spendMotivation = p => !p

            if ( Vajda.noMotivationJob?.spendMotivation ) {
                html.find('#animation').css('grid-template-rows', '1fr')
            } else {
                html.find('#animation').css('grid-template-rows', '0fr')
            }
        })

        const levelsCombobox = new west.gui.Combobox()
        for ( let i = 1; i < 10; i++ ) {
            levelsCombobox.addItem(i.toString(), `Level ${i}`)
        }

        levelsCombobox.select(1)
        levelsCombobox.addListener(v => {
            currentLevel = v
        })

        const saveButton = new west.gui.Button('Save current clothes', () => {
            Vajda.noMotivationJob?.saveCurrentEquip(currentLevel)
        })

        const deleteButton = new west.gui.Button('Delete clothes', () => {
            Vajda.noMotivationJob?.deleteCurrentEquip(currentLevel)
        })

        const input = $(`<input type='file' style='display: none' accept='json'>`)
        input.change(e => {
            const file = e.target.files[0]

            if ( file ) {
                Vajda.noMotivationJob?.importEquip(file)
            }
        })

        const importSettings = new west.gui.Button('Import', () => input.click())
        const exportSettings = new west.gui.Button('Export', () => Vajda.noMotivationJob.exportEquip())


        const isOpen = Vajda.noMotivationJob !== null && Vajda.noMotivationJob.spendMotivation
        const html = $(`
            <div style='position: absolute; top: 110px; width: calc(100% - 4rem); padding: 0 2rem'>
                <div id='single-job-settings'></div>

                <div id='animation' style='display: grid; grid-template-rows: ${isOpen ? '1fr' : '0fr'}; overflow: hidden; transition: grid-template-rows .4s'>
                    <span style='overflow: hidden'>
                        <div id='single-job-clothes-settings' style='display: flex; justify-content: space-around; padding: 1rem 0'></div>
                        <div id='single-job-options' style='display: flex; justify-content: space-around; padding: 1rem 0'></div>
                        <div id='single-job-imported-sets'></div>
                    </span>
                </div>
            </div>
        `)

        html.append(input)
        html.find('#single-job-settings').append(motivationSpendCheckbox.getMainDiv())
        html.find('#single-job-clothes-settings').append(levelsCombobox.getMainDiv())
        html.find('#single-job-clothes-settings').append(saveButton.getMainDiv())
        html.find('#single-job-clothes-settings').append(deleteButton.getMainDiv())
        html.find('#single-job-options').append(importSettings.getMainDiv())
        html.find('#single-job-options').append(exportSettings.getMainDiv())

        return html
    }

    Vajda.createAddedJobsTab = function() {
        const htmlSkel = $(`<div id='added_jobs_overview'></div>`)
        const footerHtml = $(`
            <div id='start_vajda' style='position: relative'>
                <span id='vajda-state-info' class='vajda_state' style='position: absolute; left: 20px; top: 10px; font-family: Arial, Helvetica, sans-serif; font-size: 15px; font-weight: bold;'>
                    Current state: ${Vajda.states[Vajda.currentState]}
                </span>
                <div class='vajda_run' style='position: absolute; right: 15px; top: 20px'></div>
            </div>
        `)
        const table = new west.gui.Table()
        table.addColumn("jobIcon","jobIcon").addColumn("jobName","jobName").addColumn("jobStopMotivation","jobStopMotivation").addColumn("jobSet","jobSet").addColumn("jobRemove","jobRemove")
        table.appendToCell("head","jobIcon","Job icon").appendToCell("head","jobName","Job name").appendToCell("head","jobStopMotivation","Stop motivation").appendToCell("head","jobSet","Job set").appendToCell("head","jobRemove","")
        for ( let job = 0; job < Vajda.addedJobs.length; job++ ) {
            table.appendRow().appendToCell(-1,"jobIcon", Vajda.getJobIcon(Vajda.addedJobs[job].isSilver, Vajda.addedJobs[job].id, Vajda.addedJobs[job].x, Vajda.addedJobs[job].y)).appendToCell(-1,"jobName", Vajda.getJobName(Vajda.addedJobs[job].id)).appendToCell(-1,"jobStopMotivation", Vajda.createMinMotivationTextfield(Vajda.addedJobs[job].x, Vajda.addedJobs[job].y, Vajda.addedJobs[job].id, Vajda.addedJobs[job].stopMotivation)).appendToCell(-1,"jobSet", Vajda.createComboxJobSets(Vajda.addedJobs[job].x, Vajda.addedJobs[job].y, Vajda.addedJobs[job].id)).appendToCell(-1,"jobRemove", Vajda.createRemoveJobButton(Vajda.addedJobs[job].x, Vajda.addedJobs[job].y, Vajda.addedJobs[job].id))
        }
        const buttonStart = new west.gui.Button("Start", this.beginRun)
        const buttonStop = new west.gui.Button("Stop",function() {
            Vajda.isRunning = false
            Vajda.currentState = 0
            Vajda.selectTab("chosenJobs")
            Observer.stop()
        })
        const selectAndStart = new west.gui.Button('Select And Start', this.selectSilverJobs.bind(this))
        htmlSkel.append(table.getMainDiv())
        if ( Vajda.addedJobs.length === 1 ) {
            htmlSkel.append(Vajda.createSingleJobMenu())
        }
        $('.vajda_run', footerHtml).append(selectAndStart.getMainDiv())
        $(".vajda_run", footerHtml).append(buttonStart.getMainDiv())
        $(".vajda_run", footerHtml).append(buttonStop.getMainDiv())
        htmlSkel.append(footerHtml)
        return htmlSkel
    }


    Vajda.createStatisticsGui = function() {
        const offsetLeft = '.5rem'

        const statsBubbleStyle = `'
            padding: 1rem 2rem;
            border-radius: 10px;
            background-color: rgba(255, 255, 228, .3);
            position: relative;
            box-shadow: 0 0 5px rgba(0, 0, 0, .2)
        '`

        const pseudoHeadingStyle = `'
            display: block;
            width: calc(100% - ${offsetLeft});
            padding-left: ${offsetLeft};
            border-bottom: 1px solid black;
            margin-bottom: .5rem
        '`

        const refreshStats = `
            <div style=${statsBubbleStyle}>
                <b style=${pseudoHeadingStyle}>REFRESH COUNT</b>
                <p style='padding-left:${offsetLeft}'>Total in this session: ${Observer.refreshCount}</p>
            </div>
        `

        return $(`
            <div id='statistics_overview' style='padding: 0 2rem; display: grid; gap: 1rem'>
                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>EXPERIENCE</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionXpCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalXpCount)}</p>
                </div>

                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>MONEY</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionMoneyCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalMoneyCount)}</p>
                </div>

                <div style=${statsBubbleStyle}>
                    <b style=${pseudoHeadingStyle}>JOBS</b>
                    <p style='padding-left: ${offsetLeft}'>Total in this session: ${Vajda.formatNumber(Vajda.statistics.sessionJobsCount)}</p>
                    <p style='padding-left: ${offsetLeft}'>Total overall: ${Vajda.formatNumber(Vajda.statistics.totalJobsCount)}</p>
                </div>

                ${Observer.isEnabled ? refreshStats : ''}
            </div>
        `)
    }

    Vajda.createSettingsGui = function() {
        if ( !this.settings.minHP ) throw new Error()

        const settings = this.settings
        const htmlSkel = $(`
            <div id='settings_overview' style='padding: 30px 10px 10px'>
                <div id='simple-settings' style='display: grid; grid-template-columns: 1fr 1fr'></div>
            </div>
        `)

        const simpleSettings = htmlSkel.find('#simple-settings')

        const manualLink = `
            <div onclick=Vajda.selectTab('manual') style="cursor: pointer; text-decoration: underline; position: absolute; top: 20px; right: 25px;">
                Open User Manual <svg style="width: 10px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/></svg>
            </div>
        `

        htmlSkel.append(manualLink)

        simpleSettings.append(this.createCheckbox('Add Energy', settings.addEnergy, val => settings.addEnergy = val))
        simpleSettings.append(this.createCheckbox('Add Motivation', settings.addMotivation, val => settings.addMotivation = val))
        simpleSettings.append(this.createCheckbox('Add Health', settings.addHealth, val => settings.addHealth = val))
        simpleSettings.append(this.createCheckbox('Optimize For Butt Plugs And Cake Decorations', Manager.isOptimized, val => Manager.isOptimized = val))
        simpleSettings.append(this.createCheckbox('Remember Consumables Selection', settings.rememberSelection.consumables, val => settings.rememberSelection.consumables = val))
        simpleSettings.append(this.createCheckbox('Remember Travel Buff Selection', settings.rememberSelection.travelBuff, val => settings.rememberSelection.travelBuff = val))
        simpleSettings.append(this.createCheckbox('Remember Character Buff Selection', settings.rememberSelection.characterBuff, val => settings.rememberSelection.characterBuff = val))

        const style = (isOpen, maxHeight) => `'
            overflow: hidden;
            max-height: ${isOpen ? maxHeight : '0'}px;
            transition: max-height .5s;
        '`

        const nightshiftWorkerHTML = $(`
            <div>
                <div id='nightshiftworker-checkbox'></div>
                <div id='nightshiftworker-input' style=${style(this.nightshiftWorker.isEnabled, 30)}>
                    Jobs swap time
                </div>
            </div>
        `)

        nightshiftWorkerHTML.find('#nightshiftworker-checkbox').append(this.createCheckbox('Enable Night Shift Worker', this.nightshiftWorker.isEnabled, val => {
            this.nightshiftWorker.isEnabled = val
            $(`#nightshiftworker-input`).css('max-height', val ? '30px' : '0px')
        }))

        nightshiftWorkerHTML.find('#nightshiftworker-input').append(this.createTextfield(this.nightshiftWorker.swapTime, e => {
            const regex = /^(\d{1,2}):(\d{2})$/
            const input = e.target.value
            if ( input.match(regex) ) {
                this.nightshiftWorker.swapTime = input
            } else {
                new UserMessage('Incorrect time format', UserMessage.TYPE_ERROR).show()
            }
        }, 60))

        simpleSettings.append(nightshiftWorkerHTML)


        const depositHTML = $(`
            <div>
                <div id='deposit-checkbox'></div>

                <div style=${style(Vajda.settings.addDeposit.isEnabled, 30)} id='deposit-limit-input'>
                    Deposit when more than
                </div>
            </div>
        `)

        const value = Number.isNaN(this.settings.addDeposit.limit) ? '' : this.settings.addDeposit.limit

        depositHTML.find('#deposit-checkbox').append(this.createCheckbox('Deposit money in your hometown', settings.addDeposit.isEnabled, val => {
            if ( Character.homeTown.town_id === 0 ) {
                new UserMessage("You don't have a home town", UserMessage.TYPE_HINT).show()
                return
            }

            settings.addDeposit.isEnabled = val

            $(`#deposit-limit-input`).css('max-height', val ? '30px' : '0px')
        }))

        depositHTML.find('#deposit-limit-input').append(this.createTextfield(value, e => {
            const val = e.target.value

            if ( Vajda.isNumber(val) ) {
                Vajda.settings.addDeposit.limit = val
            }
        }, 60))

        depositHTML.find('#deposit-limit-input').append(` $ in cash`)

        simpleSettings.append(depositHTML)

        const observerHTML = $(`
            <div>
                <div id='delay-checkbox'>

                </div>
                <div style=${style(Observer.isEnabled)} id='observer-delay-input'>
                    Refresh page after
                </div>
            </div>
        `)

        observerHTML.find('#observer-delay-input').append(this.createTextfield(Observer.getTimeOut(true), e => {
            const val = e.target.value.replace(',', '.')

            if ( this.isNumber(val) ) {
                Observer.timeOut = val
            }
        }, 100))

        observerHTML.find('#observer-delay-input').append(` minutes since the last action`)

        observerHTML.find('#delay-checkbox').append(this.createCheckbox('[Experimental] Enable auto refresh → Read user manual', Observer.isEnabled, val => {
            Observer.isEnabled = () => {
                $('#observer-delay-input').css('max-height', val ? '30px' : '0px')

                this.isRunning && val && Observer.start(forceStart = true)
                this.isRunning && !val && Observer.stop()

                return val
            }
        }))

        htmlSkel.append(observerHTML)

        const htmlHealthStop = $("<div>Stoppage health value </div>")
        htmlHealthStop.append(this.createTextfield(this.settings.minHP, e => this.settings.minHP = Number(e.target.value), 100))

        htmlSkel.append(htmlHealthStop)

        const htmlSetWearDelay = $("<div>Job set equip delay </div>")
        htmlSetWearDelay.append(this.createTextfield(this.settings.setWearDelay, e => this.settings.setWearDelay = Number(e.target.value), 100))

        htmlSkel.append(htmlSetWearDelay)

        return htmlSkel
    }

    Vajda.createManualGui = function() {
        const listStyle = `'padding-inline-start: 14px'`
        const nestedListStyle = `'padding-inline-start: 30px'`
        const containerStyle = `'
            padding: 0 30px 30px
        '`

        const html = $(`
            <div style=${containerStyle}>
                <h2>Read Before use</h3>
                <ol style=${listStyle}>
                    <li>
                        <strong>Calculating optimal route</strong> takes time and memory, a lot of it. It might not be noticeable for up to 12-14 jobs,
                        but anything more than that... you will notice a short freeze of the window. I don't recommend selecting more than 18 jobs, as the
                        algorithm will take about a minute (depending on the hardware, of course) to execute, while it takes almost 8 minutes to
                        find the best route for 20 jobs. In these scenarios, your browser may appear unresponsive and prompt you to reload the page
                        or wait. I recommend being patient and allowing some time for the algorithm to complete. If that doesn't work, remove one
                        or two jobs; that's the cheapest way to solve this problem.
                    </li>

                    <li>
                        <strong>The optimization for butt plugs and cake decorations</strong> setting, which is most likely why you are here:
                        <ul style=${nestedListStyle}>
                            <li>The setting has to be enabled <i>before</i> you start Gabor, it won't work otherwise</li>
                            <li>The <i>Add motivation</i> setting has to be enabled as well</li>
                            <li>Do not start Gabor with low energy and consumables on cooldown</li>
                            <li>Do not use consumables yourself while it's running</li>
                            <li>
                                You don't have to select consumables manually with this setting, Gabor will do it for you. Just make sure
                                you have enough of them butt plugs and decorations
                            </li>
                        </ul>

                        These restrictions are simply the cost of having Gabor refill energy <i>while</i> doing jobs.
                    </li>

                    <li>
                        Gabor can <strong>travel</strong> to jobs that you can't do in travel set (unless you are super low level).
                    </li>

                    <li>
                        <strong>Buffs</strong> will be used automatically when selected (and when no buff is active, of course). Only one buff
                        of each type can be selected at once. Keep in mind that consumables with cooldown are <b>not</b> treated as buffs and will
                        only be used to refill whatever your character needs.
                    </li>

                    <li>
                        Gabor will display <strong>all silver jobs</strong>, not just those you can do and are closest to yoor character. This
                        allows you <i>some</i> control of the route, for instance there might be multiple silver jobs of the same kind and one
                        of them might simply be in a more advantageous position.
                    </li>

                    <li>
                        When <strong>Auto Refresh</strong> is enabled, Gabor will refresh the page and start automatically <i>n</i> minutes
                        after starting a job (or walking to one). Starting new jobs will restart this countdown. Do not set the delay to low numbers,
                        Gabor enforces a minimum of 2.5 minutes anyway, however, I do recommend a slightly longer delay.
                    </li>
                </ol>
                <h3 style='margin:10px 0'>Farming Assistant</h3>
                <ol style=${listStyle}>
                    <li>
                        Farming assistant is available only when one job is added. It will spend all motivation on the selected job. If
                        the selected job is silver, Gabor will choose the nearest normal job, spend motivation there and come back to the selected
                        silver job to keep working like the slave it is.
                    </li>
                    <li>
                        Some jobs give less xp when your character has 0LP (sometimes 1 or even 2LP works as well). You will have to figure out
                        the set of clothes for each level on your own, however, once you have figured it out, you can export the sets to a file.
                        The next time you farm the very same job, you can simply import the settings from that file and you're good to go.

                        Feel free to ignore this option when you don't need specific sets for a specific level, Gabor will not change your equip when
                        no equip for a level is selected.
                    </li>
                    <li>
                        To save clothes set for a certain level, put it on your character, then select the level and hit the 'Save current clothes'
                        button (no shit, Sherlock). Omit step one to delete a set.
                    </li>
                    <li>
                        Gabor will not change into job set while spending motivation.
                    </li>
                    <li>
                        Please note that Gabor will use motivation consumables when selected. However, it won't use buffs when spending motivation.
                    </li>
                </ol>
                <h3 style='margin: 10px 0'>Night Shift Worker</h3>
                <ol style=${listStyle}>
                    <li>
                        Enable this setting to automatically refresh the page at the specified time to select new silver jobs.
                    </li>
                    <li>
                        <strong>Job Pool</strong> is the list of jobs Gabor will look for when swapping silver jobs. If any of the jobs in
                        job pool is silver, Gabor will select the job.
                    </li>
                    <li>
                        You have the option to keep a job even if not silver
                    </li>
                    <li>
                        Don't forget to select a set for the jobs (in the Job Pool tab). If, for any reason, you need a different set for
                        certain jobs, you have this option as well.
                    </li>
                    <li>
                        The <b>Select And Start</b> button will select jobs based on the job pool and start Gabor.
                    </li>
                </ol>
            </div>
        `)

        const container = new west.gui.Scrollpane().getMainDiv()
        container.style = 'height: 400px; overflow-y: scroll'
        container.append(html.get(0))


        return container
    }

    Vajda.createMenuIcon = function() {
        const menuImage = 'data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAAEnQAABJ0Ad5mH3gAAAAHdElNRQfoBAYRFRI/wJRIAAAGTUlEQVRIxzWUSY+b1xFFT733vokz2TObsuRuyVIcZFrGCRABWWWT36SfFmSRTYAosGU7kh0HtqxQ7olskt/4piyorAtVwL11z5Xnf/pzVMowHs8oipxBPyUxmuGoR3SeEOH9asf7m3u2ZcPd3Q0iQGdRaUHlOrpqgw4OMTn94QiT9gkSYXODUQ7jmxIvwp2tSYym7PcZDHu4tiAzKUmW00s1s3FBosE2ORWCUxrRhjRJkeBx1ZpidkSwDmtbMBoVHbarMESPiBB8oLER27ZsNiu0KBSyn+Eoy4amaYkxUiQZEgRDj0pSok4IKHCeaFuCErTJiUBwHcbZDqU1ovTeBgKCxlpLU5Y426BE0Cahn6XkeYLWhuAipq453mxpgmfZlhSrK1z0BK3Qrk9pG0KMGOsdKkZEeZI0AYlY21GVW3SE0+MTFosFx8cnTKZTev0eAHVdU69W/PT3L1h+8x23zYZRdIhS2CgUtuUay045zF6BgIAYwXtPtduRGc3p0RG//MWvuLi8oCgKlNK4rqOqK0wvpzATJp/9hu3VNWHzE1ZbdJ4jzqEczEdDbrGYosgRUcQYiC7inSNPMxYP5izO5oxnU/qDASKRcrvl7vqGums5PDwgL3p0RE5+/piPbm+IAkb3qFyJcp7URw7EoJRSJHlKmuekWUaeF5wv5jx+/AnnHz3i6PiMLC+w1nO/3XJfVUwPjziZL6jrlr/89W+Uqeb4+JRhb0x/MMYoTaENvm7I2oAJAKIQpdBayAcpp/NzptMZB7MDDg5mmESjjKasaq6ub9EoVle3VJsdtumwE2EwO8C5NT5JQTTEAAhRBGWMQX/4i2jFaDRiNjsgzTMgAJEYAvWupkgynl5c4poWCZ6z+RnP//icZ88+YTAcoLxH7U9jo9/vKsHk2qCMwTpPCAElkBlNnhjq3Q43niBJgoqBXp4SwgcACbRtzcXFJZ2zmFXFu1f/YnOzorMNjkghCUYUJsSID4EgggYezOdcfvyIwWjIZr1BKYVJE0azKUIguEBd1ew299y+v+Gnt0vGh2PG58f4TNGuKlz0OAJGhFoixqiCmKWI1hhrOT86YVz0cZ1lMhljkpQPlAIaZdQeXhT9vM+2ukN7RRShrzO8KfAS8ErRmYTvXYmqXUlbbml3Gzrb8W75ntvlkuW33+G7DlECsq8XUYIohTKaoreHsms61rdrnPMYrcnyHkVakIlBnN9b2bUtYi0oTacV//j6S8bDIZ8++wSTpnjv0SZBlEKAGCPaJJg8cP7kgpOHC9q6Zrde0xIobUMhmhSFjgHrHKrrLNZaurbFWcv6fsPnr9/gtSHNC5RoYoz83zBQH2Kp6byjrGtqa6nqmsq3NF2DEkUvK9BR0XYdSqf7Muyalq5usZ3jx/8u+XG53BOcmr0CERAFInTWUtctUSmK0YjecLRPpw/0dIIpcnofP0BnCUrAaBFijDjvYNjH9AfcLd/z+s1rLh8/ItMZoiMBIELwHuscVV0TiYhSNGXF8vV3SO0QZVi3Fe1uRRojT9IhejKbvgghgjHIdEQQob65wXYNlw8fkGiFSVOU1kTZ44mASVOKvKDtLP98+ZL1528YNBaUIgLX61sOQsJQEvTs8OCFShI+fvoMu6u5/8/3iHe0Xcvq+oqrd2/ZbrYMh2OMSdBak+Y5Wa8Hovjyq695+eoVvusYioEILjh2tmNmeugkQZ4+expJEwaTKU3T4LZb+iphOJ3Qn46wbY1tO05O55ycnnG6mHO2WGCt59/ffsvnX7xitVpB1/E4GTLWGrxni2PcRsrbNfLpkyfRErFEEiXM8wEFislizn30FIMhm7JmvV4RgifNM7KswDlHVzc45/C2I9GahSmY6JRRnjMajihXd1y9fYtezGYvxO+7/zAqnvXG9EVxn2gOLx5TN5bJ0THzhw/o2o71as1uu4UQyfOc0XhMliUE22FCZJoUpChW6zWegJeAOcXgvacOjlxrltsVHw0PmOUDkn6favmeuq34/fM/8NvPfsebb75ht90wHY8IzlNtt9zdXPHDVxsSBBMjrmmpbEtqcmbnZ+hfF+MXa98QjCZPM5wIShTWOZo0QWlhs76j3G45OjklyXoMRyNUCKxub3n39gf6reVnps9iNOO63KJ8QBBWTUnsAv8DcRZDZR4D5acAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDQtMDZUMTc6MjE6MTUrMDA6MDAjhIscAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA0LTA2VDE3OjIxOjE1KzAwOjAwUtkzoAAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wNC0wNlQxNzoyMToxOCswMDowMGQbc78AAAAASUVORK5CYII='
        let div = $('<div class="ui_menucontainer" />')
        let link = $(`<div id="vajda_menu" class="menulink" onclick=Vajda.loadJobs() title="Gábor Székesfehervár Balaton Szabadi Sóstó" />`).css('background-image', 'url(' + menuImage + ')')
        $('#ui_menubar').append((div).append(link).append('<div class="menucontainer_bottom" />'))
    }


    Vajda.createWindow = function(isHumanAction = true) {
        const window = wman.open("vajda").setResizeable(false).setMinSize(650, 480).setSize(650, 480).setMiniTitle("Chvostnatý Gábor")
        const tabs = {
            "jobs": "Jobs",
            "chosenJobs": "Chosen Jobs",
            "sets": "Sets",
            "jobPool": "Job Pool",
            "consumables": "Consumables",
            "stats": "Statistics",
            "settings": "Settings",
            "manual": "User Manual"
        }

        let tabLogic = function(win,id) {
            const content = $(`<div class='vajda-window'></div>`)
            switch(id) {
                case 'jobs':
                    Vajda.loadJobData(function(){
                        Vajda.removeActiveTab(this)
                        Vajda.removeWindowContent()
                        Vajda.addActiveTab("jobs",this)
                        try {
                            content.append(Vajda.createJobsTab())
                        } catch {
                            content.append(Vajda.createErrorTab('jobs'))
                        }
                        Vajda.window.appendToContentPane(content)
                        Vajda.addJobTableCss()
                        $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": Vajda.jobTablePosition.content})
                        $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": Vajda.jobTablePosition.scrollbar})
                        Vajda.addEventsHeader()
                    })
                    break
                case 'chosenJobs':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("chosenJobs", this)
                    content.append(Vajda.createAddedJobsTab())
                    Vajda.window.appendToContentPane(content)
                    $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": Vajda.addedJobTablePosition.content})
                    $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": Vajda.addedJobTablePosition.scrollbar})
                    Vajda.addAddedJobsTableCss()
                    break
                case 'jobPool':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("jobPool", this)
                    try {
                        content.append(Vajda.createJobsPoolGui())
                    } catch {
                        content.append(Vajda.createErrorTab('jobPool'))
                    }
                    Vajda.window.appendToContentPane(content)
                    break
                case 'sets':
                    Vajda.loadSets(function() {
                        Vajda.removeActiveTab(this)
                        Vajda.removeWindowContent()
                        Vajda.addActiveTab("sets",this)
                        try {
                            content.append(Vajda.createSetGui())
                        } catch {
                            content.append(Vajda.createErrorTab('sets'))
                        }
                        Vajda.window.appendToContentPane(content)
                    })
                    break
                case 'consumables':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("consumables",this)
                    Vajda.findAllConsumables()
                    content.append(Vajda.createConsumablesTable())
                    Vajda.window.appendToContentPane(content)
                    $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css({"top": Vajda.consumableTablePosition.content})
                    $(".vajda-window .tw2gui_scrollbar_pulley").css({"top": Vajda.consumableTablePosition.scrollbar})
                    Vajda.addConsumableTableCss()
                    break
                case 'stats':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("stats",this)
                    content.append(Vajda.createStatisticsGui())
                    Vajda.window.appendToContentPane(content)
                    break
                case 'settings':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("settings",this)
                    try {
                        content.append(Vajda.createSettingsGui())
                    } catch {
                        content.append(Vajda.createErrorTab('settings'))
                    }
                    Vajda.window.appendToContentPane(content)
                    break
                case 'manual':
                    Vajda.removeActiveTab(this)
                    Vajda.removeWindowContent()
                    Vajda.addActiveTab("manual", this)
                    content.append(Vajda.createManualGui())
                    Vajda.window.appendToContentPane(content)
                    break
            }
        }

        for(let tab in tabs) {
            window.addTab(tabs[tab],tab,tabLogic)
        }

        Vajda.window = window

        if ( !isHumanAction ) wman.close('vajda')

        Vajda.selectTab('jobs')
    }

    Vajda.selectTab = function(key) {
        Vajda.window?.tabIds[key].f(Vajda.window,key)
    }

    Vajda.removeActiveTab = function(window) {
        $('div.tw2gui_window_tab', window.divMain).removeClass('tw2gui_window_tab_active')
    }

    Vajda.addActiveTab = function(key, window) {
        $(`div._tab_id_${key}`, window.divMain).addClass('tw2gui_window_tab_active')
    }

    Vajda.removeWindowContent = function() {
        $(".vajda-window").remove()
    }

    Vajda.addConsumableTableCss = function() {
        $(".vajda-window .consumIcon").css({"width":"80px"})
        $(".vajda-window .consumCount").css({"width":"60px"})
        $(".vajda-window .consumEnergy").css({"width":"60px"})
        $(".vajda-window .consumMotivation").css({"width":"70px"})
        $(".vajda-window .consumHealth").css({"width":"60px"})
        $(".vajda-window .consumBuffs").css({"width": "150px"})
        $(".vajda-window .row").css({"height":"80px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    }

    Vajda.addJobTableCss = function() {
        $(".vajda-window .jobIcon").css({"width":"80px"})
        $(".vajda-window .jobName").css({"width":"150px"})
        $(".vajda-window .jobXp").css({"width":"40px"})
        $(".vajda-window .jobMoney").css({"width":"40px"})
        $(".vajda-window .jobMotivation").css({"width":"40px"})
        $(".vajda-window .jobDistance").css({"width":"100px"})
        $(".vajda-window .row").css({"height":"60px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    }

    Vajda.addAddedJobsTableCss = function() {
        $(".vajda-window .jobIcon").css({"width":"80px"})
        $(".vajda-window .jobName").css({"width":"130px"})
        $(".vajda-window .jobStopMotivation").css({"width":"110px"})
        $(".vajda-window .jobRemove").css({"width":"105px"})
        $(".vajda-window .jobSet").css({"width":"100px"})
        $(".vajda-window .row").css({"height":"60px"})
        $('.vajda-window').find('.tw2gui_scrollpane').css('height', '250px')
    }

    Vajda.createJobsTab = function() {
        if ( !this.nightshiftWorker ) throw new Error()
        const htmlSkel = $(`<div id='jobs_overview'></div>`)
        const html = $(`
            <div class='jobs_search' style='position: relative'>
                <div id='jobFilter' style='position: absolute; top: 10px; left: 15px'></div>
                <div id='job_only_silver' style='position: absolute; top:10px; left: 200px;'></div>
                <div id='job_no_silver' style='position: absolute; top: 10px; left: 270px;'></div>
                <div id='job_center' style='position: absolute; top: 10px; left: 350px;'></div>
                <div id='button_filter_jobs' style='position: absolute; top: 5px; left: 450px;'></div>
            </div>
        `)

        const table = new west.gui.Table()
        const arrow_desc = '&nbsp;<img src="../images/window/jobs/sortarrow_desc.png"/>'
        const arrow_asc = '&nbsp;<img src="../images/window/jobs/sortarrow_asc.png"/>'
        const uniqueJobs = Vajda.getAllUniqueJobs()
        table
            .addColumn("jobIcon", "jobIcon")
            .addColumn("jobName", "jobName")
            .addColumn("jobDistance", "jobDistance")
            .addColumn("jobAdd", "jobAdd")
            .addColumn("poolAdd", "poolAdd")
        table
            .appendToCell("head", "jobIcon", "Job icon")
            .appendToCell("head", "jobName", "Job name")
            .appendToCell("head", "jobDistance", "Distance " + (Vajda.sortJobTableDistance == 1 ? arrow_asc : Vajda.sortJobTableDistance == -1 ? arrow_desc : ""))
            .appendToCell("head", "jobAdd", "")
            .appendToCell("head", "poolAdd", "")
        for ( let job = 0; job < uniqueJobs.length; job++ ) {
            table
                .appendRow()
                .appendToCell(-1, "jobIcon",Vajda.getJobIcon(uniqueJobs[job].isSilver,uniqueJobs[job].id,uniqueJobs[job].x,uniqueJobs[job].y))
                .appendToCell(-1, "jobName",Vajda.getJobName(uniqueJobs[job].id))
                .appendToCell(-1, "jobDistance",uniqueJobs[job].distance.formatDuration())
                .appendToCell(-1, "jobAdd", Vajda.createAddJobButton(uniqueJobs[job].x,uniqueJobs[job].y,uniqueJobs[job].id))
                .appendToCell(-1, "poolAdd", Vajda.createAddToJobsPoolButton(uniqueJobs[job].id))
        }
        const textfield = new west.gui.Textfield("jobsearch").setPlaceholder("Select job name")
        if ( Vajda.jobFilter.filterJob !== "" ) {
            textfield.setValue(Vajda.jobFilter.filterJob)
        }

        const checkboxOnlySilver = new west.gui.Checkbox()
        checkboxOnlySilver.setLabel("Silvers")
        checkboxOnlySilver.setSelected(Vajda.jobFilter.filterOnlySilver)
        checkboxOnlySilver.setCallback(function() {
            if ( this.isSelected() ) {
                Vajda.jobFilter.filterOnlySilver = true
            }else {
                Vajda.jobFilter.filterOnlySilver = false
            }
        })
        const checkboxNoSilver = new west.gui.Checkbox()
        checkboxNoSilver.setLabel("No silvers")
        checkboxNoSilver.setSelected(Vajda.jobFilter.filterNoSilver)
        checkboxNoSilver.setCallback(function() {
            if ( this.isSelected() ) {
                Vajda.jobFilter.filterNoSilver = true
            } else {
                Vajda.jobFilter.filterNoSilver = false
            }
        })
        const checkboxCenterJobs = new west.gui.Checkbox()
        checkboxCenterJobs.setLabel("Center jobs")
        checkboxCenterJobs.setSelected(Vajda.jobFilter.filterCenterJobs)
        checkboxCenterJobs.setCallback(function() {
            if ( this.isSelected() ) {
                Vajda.jobFilter.filterCenterJobs = true
            } else {
                Vajda.jobFilter.filterCenterJobs = false
            }
        })
        const buttonFilter = new west.gui.Button("Filter", function() {
            Vajda.jobFilter.filterJob = textfield.getValue()
            Vajda.jobTablePosition.content = "0px"
            Vajda.jobTablePosition.scrollbar = "0px"
            Vajda.selectTab("jobs")
        })
        htmlSkel.append(table.getMainDiv())
        $('#jobFilter', html).append(textfield.getMainDiv())
        $("#job_only_silver",html).append(checkboxOnlySilver.getMainDiv())
        $("#job_no_silver",html).append(checkboxNoSilver.getMainDiv())
        $("#job_center",html).append(checkboxCenterJobs.getMainDiv())
        $("#button_filter_jobs",html).append(buttonFilter.getMainDiv())
        htmlSkel.append(html)
        return htmlSkel
    }

    Vajda.createMinMotivationTextfield = function(x, y, id, placeholder) {
        const componentId = `x-${x}y-${y}id-${id}`
        const textfield = new west.gui.Textfield()
        textfield.setId(componentId)
        textfield.setWidth(40)
        textfield.setValue(placeholder)
        return textfield.getMainDiv()
    }

    Vajda.createRemoveJobButton = function(x, y, id) {
        const buttonRemove = new west.gui.Button("Remove job", function() {
            Vajda.removeJob(x, y, id)
            Vajda.addedJobTablePosition.content = $(".vajda-window .tw2gui_scrollpane_clipper_contentpane").css("top")
            Vajda.addedJobTablePosition.scrollbar = $(".vajda-window .tw2gui_scrollbar_pulley").css("top")
            Vajda.selectTab("chosenJobs")
        })
        buttonRemove.setWidth(100)
        return buttonRemove.getMainDiv()
    }


    $(document).ready(() => {
        try {
            Vajda.loadLanguage()
            Vajda.loadSets()
            Vajda.createMenuIcon()
            Vajda.getCookies()
            Observer.resumeSession()
            Vajda.initSilverJobsSwap()
        } catch(e) {
            console.log(e)
            console.log("exception occured")
        }
    })
})()