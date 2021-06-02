import BackgroundJob from './../../../core/service_stepcounter'

export const StartServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (!isRun) {
        BackgroundJob.start();
    }
}

export const StopServiceStepCounter = () => {
    let isRun = BackgroundJob.isRunning();
    if (isRun) {
        BackgroundJob.stop()
    }
}

export const setValueShowStepTarget = (value) => {
    if (isRun) {
        BackgroundJob.setValueShowStepTarget(value)
    }
}
