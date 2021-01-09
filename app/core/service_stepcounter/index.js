import {
    Platform,
    AppRegistry,
    DeviceEventEmitter,
    NativeAppEventEmitter,
    NativeEventEmitter,
} from 'react-native';
import { getIsShowNotification } from '../storage';
import RNBackgroundActions from './ServiceStepCounter';
const Emitter = new NativeEventEmitter(RNBackgroundActions);
/**
 * @typedef {{taskName: string,
 *            taskTitle: string,
 *            taskDesc: string,
 *            taskIcon: {name: string, type: string, package?: string},
 *            color?: string
 *            linkingURI?: string,
 *            progressBar?: {max: number, value: number, indeterminate?: boolean},
 *            targetStep: int,
 *            currentStep: int,
 *            isShowStep: boolean
 * 
 *            }} BackgroundTaskOptions
 */
class BackgroundServer {
    constructor() {
        /** @private */
        this._runnedTasks = 0;
        /** @private @type {(arg0?: any) => void} */
        this._stopTask = () => { };
        /** @private */
        this._isRunning = false;
        /** @private @type {BackgroundTaskOptions} */
        this._currentOptions;


        this.uniqueId = 0;
        this.callbacks = {};

        Emitter.addListener('EMIT_EVENT_TIMEOUT', (id) => {
            if (this.callbacks[id]) {
                const callbackById = this.callbacks[id];
                const { callback } = callbackById;
                if (!this.callbacks[id].interval) {
                    delete this.callbacks[id];
                } else {
                    RNBackgroundActions.setTimeout(id, this.callbacks[id].timeout);
                }
                callback();
            }
        });
    }

    /**
     * **ANDROID ONLY**
     *
     * Updates the task notification.
     *
     * *On iOS this method will return immediately*
     *
     * @param {{taskTitle?: string,
     *          taskDesc?: string,
     *          taskIcon?: {name: string, type: string, package?: string},
     *          color?: string,
     *          linkingURI?: string,
     *          progressBar?: {max: number, value: number, indeterminate?: boolean},
     *          targetStep: int,
     *          currentStep: int,
     *          isShowStep: boolean
     * }}
     */
    async updateNotification(taskData) {
        if (Platform.OS !== 'android') return;
        if (!this.isRunning())
            throw new Error('A BackgroundAction must be running before updating the notification');
        this._currentOptions = this._normalizeOptions({ ...this._currentOptions, ...taskData });
        await RNBackgroundActions.updateNotification(this._currentOptions);
    }

    /**
     * Returns if the current background task is running.
     *
     * It returns `true` if `start()` has been called and the task has not finished.
     *
     * It returns `false` if `stop()` has been called, **even if the task has not finished**.
     */
    isRunning() {
        return this._isRunning;
    }

    observerStep(callback) {
        DeviceEventEmitter.addListener(
            'EMIT_EVENT_STEP',
            steps => callback(steps)
        )
    }

    observerShowNotification(callback) {
        DeviceEventEmitter.addListener(
            'EMIT_SHOW_NITIFICATION',
            () => {
                getIsShowNotification().then(res => callback(res))
            }
        )
    }

    isSupportStepCounter(callback) {
        RNBackgroundActions.isSupportStepCounter(callback)
    }

    updateTypeNotification() {
        RNBackgroundActions.updateTypeNotification()
    }

    /**
     * @param {(taskData: any) => Promise<void>} task
     * @param {BackgroundTaskOptions & {parameters?: any}} options
     * @returns {Promise<void>}
     */
    async start(task, options) {
        this._runnedTasks++;
        this._currentOptions = this._normalizeOptions(options);
        const finalTask = this._generateTask(task, options.parameters);
        if (Platform.OS === 'android') {
            AppRegistry.registerHeadlessTask(this._currentOptions.taskName, () => finalTask);
            await RNBackgroundActions.start(this._currentOptions);
        } else {
            await RNBackgroundActions.start(this._currentOptions);
            finalTask();
        }
        this._isRunning = true;
    }

    /**
     * @private
     * @param {(taskData: any) => Promise<void>} task
     * @param {any} [parameters]
     */
    _generateTask(task, parameters) {
        const self = this;
        return async () => {
            await new Promise((resolve) => {
                self._stopTask = resolve;
                task(parameters).then(() => self.stop());
            });
        };
    }

    /**
     * @private
     * @param {BackgroundTaskOptions} options
     */
    _normalizeOptions(options) {
        return {
            taskName: options.taskName + this._runnedTasks,
            taskTitle: options.taskTitle,
            taskDesc: options.taskDesc,
            taskIcon: { ...options.taskIcon },
            color: options.color || '#ffffff',
            linkingURI: options.linkingURI,
            progressBar: options.progressBar,
            targetStep: options.targetStep,
            currentStep: options.currentStep,
            isShowStep: options.isShowStep
        };
    }

    /**
     * Stops the background task.
     *
     * @returns {Promise<void>}
     */
    async stop() {
        this._stopTask();
        await RNBackgroundActions.stop();
        this._isRunning = false;
    }


    startSchedule(delay = 0) {
        return RNBackgroundActions.startSchedule(delay);
    }

    stopSchedule() {
        return RNBackgroundActions.stopSchedule();
    }

    runBackgroundTimer(callback, delay) {
        const EventEmitter = Platform.select({
            ios: () => NativeAppEventEmitter,
            android: () => DeviceEventEmitter,
        })();
        this.startSchedule(0);
        this.backgroundListener = EventEmitter.addListener(
            'EMIT_EVENT_TIME_SCHEDULE',
            () => {
                this.backgroundListener.remove();
                this.backgroundClockMethod(callback, delay);
            },
        );
    }

    backgroundClockMethod(callback, delay) {
        this.backgroundTimer = this.setTimeout(() => {
            callback();
            this.backgroundClockMethod(callback, delay);
        }, delay);
    }

    stopBackgroundTimer() {
        this.stopSchedule();
        this.clearTimeout(this.backgroundTimer);
    }

    // New API, allowing for multiple timers
    setTimeout(callback, timeout) {
        this.uniqueId += 1;
        const timeoutId = this.uniqueId;
        this.callbacks[timeoutId] = {
            callback,
            interval: false,
            timeout,
        };
        RNBackgroundActions.setTimeout(timeoutId, timeout);
        return timeoutId;
    }

    clearTimeout(timeoutId) {
        if (this.callbacks[timeoutId]) {
            delete this.callbacks[timeoutId];
            // RNBackgroundActions.clearTimeout(timeoutId);
        }
    }

    setInterval(callback, timeout) {
        this.uniqueId += 1;
        const intervalId = this.uniqueId;
        this.callbacks[intervalId] = {
            callback,
            interval: true,
            timeout,
        };
        RNBackgroundActions.setTimeout(intervalId, timeout);
        return intervalId;
    }

    clearInterval(intervalId) {
        if (this.callbacks[intervalId]) {
            delete this.callbacks[intervalId];
        }
    }
}

const backgroundStepCounter = new BackgroundServer();

export default backgroundStepCounter;
