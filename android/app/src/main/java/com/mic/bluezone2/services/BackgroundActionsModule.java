package com.mic.bluezone2.services;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Handler;
import android.os.PowerManager;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.LifecycleEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mic.bluezone2.schedule.NotificationStepTarget;
import com.mic.bluezone2.util.ConfigNotification;

@SuppressWarnings("WeakerAccess")
public class BackgroundActionsModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNServiceBluezone";
    private static final String EMIT_EVENT_TIME_SCHEDULE = "EMIT_EVENT_TIME_SCHEDULE";
    private static final String EMIT_EVENT_TIMEOUT = "EMIT_EVENT_TIMEOUT";
    private static final String EMIT_EVENT_STEP_SAVE = "EMIT_EVENT_STEP_SAVE";
    private static final String EMIT_EVENT_HISTORY_SAVE = "EMIT_EVENT_HISTORY_SAVE";
    private static final String EMIT_EVENT_TARGET_SAVE = "EMIT_EVENT_TARGET_SAVE";

    private final ReactContext reactContext;
    private static ReactApplicationContext reactContextStatic;

    private Intent currentServiceIntent;

    private Handler handler;
    private Runnable runnable;
    private PowerManager powerManager;
    private PowerManager.WakeLock wakeLock;
    private final LifecycleEventListener listener = new LifecycleEventListener() {
        @Override
        public void onHostResume() {
        }

        @Override
        public void onHostPause() {
        }

        @Override
        public void onHostDestroy() {
            if (wakeLock.isHeld()) wakeLock.release();
        }
    };

    public BackgroundActionsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContextStatic = reactContext;
        this.powerManager = (PowerManager) getReactApplicationContext().getSystemService(reactContext.POWER_SERVICE);
        this.wakeLock = powerManager.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "bluezone2:ALARM");
        reactContext.addLifecycleEventListener(listener);
        RNBackgroundActionsTask.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return TAG;
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void start(@NonNull final Promise promise) {
        // Stop any other intent
        if (currentServiceIntent != null) reactContext.stopService(currentServiceIntent);
        // Create the service
        currentServiceIntent = new Intent(reactContext, RNBackgroundActionsTask.class);
        // Start the task
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            reactContext.startForegroundService(currentServiceIntent);
        } else {
            reactContext.startService(currentServiceIntent);
        }
        promise.resolve(null);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void stop(@NonNull final Promise promise) {
        if (currentServiceIntent != null)
            reactContext.stopService(currentServiceIntent);
        promise.resolve(null);
    }

    @SuppressWarnings("unused")
    @ReactMethod
    public void updateNotification(final Promise promise) {
        // Get the task info from the options
        try {
            final Notification notification = RNBackgroundActionsTask.buildNotification(reactContext);

            final NotificationManager notificationManager = (NotificationManager) reactContext.getSystemService(Context.NOTIFICATION_SERVICE);

            notificationManager.notify(RNBackgroundActionsTask.SERVICE_NOTIFICATION_ID, notification);
        } catch (Exception e) {
            if (promise != null) {
                promise.reject(e);
            }
            return;
        }
        if (promise != null) {
            promise.resolve(null);
        }
    }

    @ReactMethod
    public void isSupportStepCounter(Callback callback) {
        SensorManager mSensorManager = (SensorManager)
                reactContext.getSystemService(Context.SENSOR_SERVICE);
        boolean check = true;
        Sensor sensorStepCounter = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        if (sensorStepCounter == null) {
            check = false;
        }
        callback.invoke(check);
    }

    @ReactMethod
    public void updateTypeNotification() {
        WritableMap params = Arguments.createMap();
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EMIT_EVENT_STEP", params);
    }

    @ReactMethod
    public void updateStepTargetSuccess() {
        WritableMap params = Arguments.createMap();
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EMIT_EVENT_STEP_TARGET", params);
    }

    @ReactMethod
    public void startSchedule(final int delay) {
        if (!wakeLock.isHeld()) wakeLock.acquire();

        handler = new Handler();
        runnable = new Runnable() {
            @Override
            public void run() {
                sendEvent(reactContext, EMIT_EVENT_TIME_SCHEDULE);
            }
        };

        handler.post(runnable);
    }

    @ReactMethod
    public void stopSchedule() {
        if (wakeLock.isHeld()) wakeLock.release();
        if (handler != null) handler.removeCallbacks(runnable);
    }

    private void sendEvent(ReactContext reactContext, String eventName) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, null);
    }

    @ReactMethod
    public void setTimeout(final int id, final double timeout) {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (getReactApplicationContext().hasActiveCatalystInstance()) {
                    getReactApplicationContext()
                            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(EMIT_EVENT_TIMEOUT, id);
                }
            }
        }, (long) timeout);
    }

    @ReactMethod
    public void sendEmitSaveSuccess() {
        sendEvent(reactContext, EMIT_EVENT_STEP_SAVE);
    }

    @ReactMethod
    public void sendEmitSaveHistorySuccess() {
        sendEvent(reactContext, EMIT_EVENT_HISTORY_SAVE);
    }

    @ReactMethod
    public void sendEmitSaveTargetSuccess() {
        sendEvent(reactContext, EMIT_EVENT_TARGET_SAVE);
    }

    public static void sendEvent(String event, WritableNativeMap params) {
        reactContextStatic
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(event, params);
    }

    @ReactMethod
    public void setShowStepsTarget(boolean isShow, Promise promise) {
        ConfigNotification.toggleStepTarget(isShow, reactContext);
        updateNotification(promise);
    }

    @ReactMethod
    public void getIsShowStepTarget(Promise promise) {
        boolean res = ConfigNotification.getIsShowStepTarget(reactContext);
        promise.resolve(res);
    }

    @ReactMethod
    public void setServiceIsOpen(boolean isOpen, Promise promise) {
        ConfigNotification.toggleOnOffService(isOpen, reactContext);
        if (!isOpen) {
            Intent intent = new Intent(reactContext, RNBackgroundActionsTask.class);
            getCurrentActivity().stopService(intent);
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void getIsOpenService(Promise promise) {
        boolean res = ConfigNotification.getIsOpenService(reactContext);
        promise.resolve(res);
    }

    @ReactMethod
    public void setStepTarget(int target, Promise promise) {
        ConfigNotification.setStepTarget(target, reactContext);
        NotificationStepTarget notificationStepTarget = new NotificationStepTarget(reactContext);
        notificationStepTarget.setStepTarget(target);
        updateNotification(promise);
    }

    @ReactMethod
    public void setIsShowNotificationTarget(boolean isShow, Promise promise){
        NotificationStepTarget notificationStepTarget = new NotificationStepTarget(reactContext);
        notificationStepTarget.saveIsNoti(isShow);
        promise.resolve(null);
    }
}