const STEP_TARGET_DEFAULT = 10000

const CalculationStepTargetAndroid = (listStep, oldTarget, days) => {
    if (days == 2 && listStep.length >= 2) {
        let tmp = listStep.slice(0, 2)
        return CalculationStepTarget(tmp, oldTarget, days)
    } else if (days >= 3 && listStep.length > 2) {
        let targetNew = oldTarget;
        if (listStep.length == days) {
            targetNew = CalculationStepTarget([1, listStep[0]], targetNew)
        } else {
            targetNew = CalculationStepTarget([1, 1, listStep[0]], targetNew)
        }
        for (var i = 1; i < listStep.length; i++) {
            targetNew = CalculationStepTarget([1, 1, listStep[i]], targetNew)
        }
        return targetNew;
    } else if (days > 2 && listStep?.length <= 2) {
        let targetNew = oldTarget;
        for (var i = 0; i < listStep.length; i++) {
            targetNew = CalculationStepTarget([1, 1, listStep[i]], targetNew)
        }
        return targetNew;
    } else {
        return STEP_TARGET_DEFAULT
    }
}

const CalculationStepTarget = (listStep, oldTarget) => {
    if (!listStep || !oldTarget || listStep.length < 2) {
        return STEP_TARGET_DEFAULT
    }
    console.log('listStep',listStep)
    console.log('oldTarget',oldTarget)

    let lastItem = undefined
    let stepTarget = STEP_TARGET_DEFAULT
    if (listStep.length < 2) {
        console.log('listStep.length < 2')
        stepTarget = STEP_TARGET_DEFAULT
    } else if (listStep.length == 2) {
        console.log('listStep.length == 2')
        lastItem = listStep[1]
        if (lastItem >= STEP_TARGET_DEFAULT) {
            console.log('lastItem >= STEP_TARGET_DEFAULT')
            return STEP_TARGET_DEFAULT
        } else {
            console.log('lastItem <= STEP_TARGET_DEFAULT')
            stepTarget = lastItem + 250
        }
    } else {
        lastItem = listStep[listStep?.length - 1]
        if (lastItem <= 1000) {
            stepTarget = oldTarget;
            // stepTarget = 1000;
        } else if (lastItem > oldTarget) {
            if (oldTarget <= 5000) {
                console.log('oldTarget <= 5000')
                stepTarget = lastItem + 250
            } else {
                console.log('lastItem > oldTarget && oldTarge >= 5000')
                stepTarget = tableCalculator(lastItem, oldTarget)
            }
        } else if (lastItem < oldTarget) {
            console.log('lastItem < oldTarget')
            stepTarget = tableCalculator(lastItem, oldTarget)
        }
    }

    if (stepTarget < 1000) {
        stepTarget = 1000
    }
    if (stepTarget > STEP_TARGET_DEFAULT) {
        stepTarget = STEP_TARGET_DEFAULT
    }
    let oldStep = parseInt(stepTarget)

    let newStep = (parseInt(stepTarget / 100) * 100)
    if (oldStep - newStep >= 60) {
        newStep = newStep + 100
    }
    return newStep
}

const tableCalculator = (step, oldTarget) => {
    let tmp = Math.abs(step - oldTarget);
    if (step < oldTarget) {
        return (oldTarget - parseInt(0.2 * tmp))
    } else {
        let change = (tmp / oldTarget) * 100
        if (change >= 50.0) {
            return (oldTarget + parseInt(0.2 * tmp))
        } else {
            return (oldTarget + parseInt(0.1 * tmp))
        }
    }
}

export { CalculationStepTarget, CalculationStepTargetAndroid }