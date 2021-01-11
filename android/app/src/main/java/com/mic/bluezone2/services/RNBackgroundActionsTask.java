package com.mic.bluezone2.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mic.bluezone2.R;
import com.mic.bluezone2.model.Accelerometer;

import java.text.SimpleDateFormat;
import java.util.Date;

final public class RNBackgroundActionsTask extends HeadlessJsTaskService implements SensorEventListener {
    private static final String EVENT_COUNTER = "stepCounter";
    private static final String EVENT_DETECTOR = "stepDetector";
    private static final String EVENT_ACCELEROMETER = "stepAccelerometer";
    private static final String EMIT_EVENT_STEP = "EMIT_EVENT_STEP";
    private static final String EMIT_IS_SUPPORT = "EMIT_IS_SUPPORT";
    private static final String START_TIME = "startTime";
    private static final String END_TIME = "endTime";
    private static final String TOTAL_STEP = "totalStep";

    public static final int SERVICE_NOTIFICATION_ID = 92963;
    private static final String CHANNEL_ID = "CHANNEL_HEALTH_BLUEZONE";
    private static final String CHANNEL_ID_2 = "CHANNEL_HEALTH_BLUEZONE_NORMAL";
    private static final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    private static final Date date = new Date();
    private SensorManager mSensorManager;

    private Sensor sensorStepCounter;
    private Sensor sensorStepDetector;
    private Sensor sensorStepAccelerometer;

    private boolean isSupportStepCounter = true;

    private long lastUpdateTime = System.currentTimeMillis();
    private int lastStepCounter = 0;


    private float[] prev = {0f, 0f, 0f};
    private int stepCount = 0;
    private static final int ABOVE = 1;
    private static final int BELOW = 0;
    private static int CURRENT_STATE = 0;
    private static int PREVIOUS_STATE = BELOW;
    private long streakStartTime;
    private long streakPrevTime = System.currentTimeMillis();

    @NonNull
    public static Notification buildNotification(@NonNull final ReactContext context, @NonNull final BackgroundTaskOptions bgOptions) {
        // Get info
        final String taskTitle = bgOptions.getTaskTitle();
        final double currentSteps = bgOptions.getCurrentSteps();
        boolean isShowNofi = bgOptions.isShowStep();
        int targetSteps = bgOptions.getStepsTarget();
        Log.e("TAGGGGG", "targetSteps: " + targetSteps);
        if (targetSteps == 0) {
            targetSteps = 10000;
        }
        final int iconInt = bgOptions.getIconInt();
        final String linkingURI = bgOptions.getLinkingURI();
        Intent notificationIntent;
        if (linkingURI != null) {
            notificationIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(linkingURI));
        } else {
            notificationIntent = new Intent(context, context.getCurrentActivity().getClass());
        }
        final PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);

        //custom notification
        RemoteViews notificationLayout = new RemoteViews(context.getPackageName(), R.layout.custom_notification);

        if (isShowNofi) {
            notificationLayout.setViewVisibility(R.id.txtTime, View.VISIBLE);
            notificationLayout.setViewVisibility(R.id.txtNumber, View.VISIBLE);
            notificationLayout.setViewVisibility(R.id.progressBar, View.VISIBLE);

            notificationLayout.setTextViewText(R.id.txtTime, formatter.format(date));
            notificationLayout.setTextViewText(R.id.txtNumber, "" + ((int) currentSteps) + "/" + ((int) targetSteps));
            int tmp = (int) (((float) currentSteps / targetSteps) * 100);
            notificationLayout.setProgressBar(R.id.progressBar, 100, tmp, false);
        } else {
            notificationLayout.setViewVisibility(R.id.txtTime, View.GONE);
            notificationLayout.setViewVisibility(R.id.txtNumber, View.GONE);
            notificationLayout.setViewVisibility(R.id.progressBar, View.GONE);
        }


        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
//                .setSmallIcon(R.mipmap.ic_launcher)
                .setSmallIcon(iconInt)
                .setContentTitle(taskTitle)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(notificationLayout)
                .setContentIntent(contentIntent)
                .setCustomBigContentView(notificationLayout)
                .setAutoCancel(false)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .build();

        return notification;
    }

    @Override
    protected @Nullable
    HeadlessJsTaskConfig getTaskConfig(Intent intent) {
        final Bundle extras = intent.getExtras();
        if (extras != null) {
            return new HeadlessJsTaskConfig(extras.getString("taskName"), Arguments.fromBundle(extras), 0, true);
        }
        return null;
    }


    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        final Bundle extras = intent.getExtras();
        if (extras == null) {
            throw new IllegalArgumentException("Extras cannot be null");
        }
        Context context = getApplicationContext();

        final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(extras);
        createNotificationChannel(bgOptions.getTaskTitle(), bgOptions.getTaskDesc());
        // Create the notification
        final Notification notification = buildNotification(getReactNativeHost().getReactInstanceManager().getCurrentReactContext(), bgOptions);
        startForeground(SERVICE_NOTIFICATION_ID, notification);


        mSensorManager = (SensorManager)
                context.getSystemService(Context.SENSOR_SERVICE);

        sensorStepCounter = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
//        sensorStepDetector = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_DETECTOR);
        sensorStepAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        boolean check = false;

        if (sensorStepCounter == null) {
            Log.e("StepCounter", "sensorStepCounter khong support");
            check = true;
        } else {
            mSensorManager.registerListener(this, sensorStepCounter, SensorManager.SENSOR_DELAY_FASTEST);
        }

//
//        if (sensorStepDetector == null) {
//            Log.e("StepCounter", "sensorStepDetector khong support");
//            check = true;
//        } else {
//            mSensorManager.registerListener(this, sensorStepDetector, SensorManager.SENSOR_DELAY_FASTEST);
//        }

        WritableMap params = Arguments.createMap();
        params.putBoolean(EMIT_IS_SUPPORT, !check);
        getReactNativeHost().getReactInstanceManager().getCurrentReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EMIT_EVENT_STEP, params);

        if (check) {
            mSensorManager.registerListener(this, sensorStepAccelerometer, SensorManager.SENSOR_DELAY_FASTEST);
        }

        return super.onStartCommand(intent, flags, startId);
    }

    private void createNotificationChannel(@NonNull final String taskTitle, @NonNull final String taskDesc) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            final int importance = NotificationManager.IMPORTANCE_LOW;
            final NotificationChannel channel = new NotificationChannel(CHANNEL_ID, taskTitle, importance);
            channel.setDescription(taskDesc);
            final NotificationManager notificationManager = getSystemService(NotificationManager.class);
            notificationManager.createNotificationChannel(channel);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent sensorEvent) {
        Sensor mySensor = sensorEvent.sensor;
        if (mySensor.getType() == Sensor.TYPE_STEP_COUNTER) {
            WritableMap map = Arguments.createMap();

            long curTime = System.currentTimeMillis();
            int numberStep = (int) sensorEvent.values[0];
            if (lastStepCounter == 0 && numberStep != 0) {
                lastStepCounter = numberStep;
                lastUpdateTime = curTime;
                map.putDouble(TOTAL_STEP, numberStep);
                emitValue(map);
                return;
            }
//            Log.e("TAGGGGG", "So luong buoc: " + numberStep + " - " + lastStepCounter + " - " + (numberStep - lastStepCounter));
            if (numberStep != lastStepCounter) {
                if (curTime - lastUpdateTime >= 3000) {
                    map.putDouble(END_TIME, curTime);
                    map.putDouble(EVENT_COUNTER, numberStep - lastStepCounter);
                    map.putDouble(TOTAL_STEP, numberStep);
                    double tmpStep = (Math.abs(numberStep - lastStepCounter) / 1.8) * 1000;
                    if (tmpStep < 1000) {
                        tmpStep = 1000;
                    }
                    double timeBefore = curTime - tmpStep;
                    map.putDouble(START_TIME, timeBefore);
                } else {

                    double timeTmp = numberStep - lastStepCounter;
                    if (timeTmp < 1000) {
                        timeTmp = 1000;
                    }
                    map.putDouble(START_TIME, (curTime - timeTmp));
                    map.putDouble(END_TIME, curTime);
                    map.putDouble(EVENT_COUNTER, numberStep - lastStepCounter);
                    map.putDouble(TOTAL_STEP, numberStep);
                }
                emitValue(map);
            }
            lastStepCounter = numberStep;
            lastUpdateTime = curTime;
        }

        if (mySensor.getType() == Sensor.TYPE_STEP_DETECTOR) {
//            Log.e("StepCounter", "TYPE_STEP_DETECTOR: " + sensorEvent.values[0]);
//            emitValue(EVENT_DETECTOR, sensorEvent.values[0]);
        }

        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
//            Log.e("StepCounter", "TYPE_ACCELEROMETER: " + sensorEvent.values[0]);
//            emitValue(EVENT_ACCELEROMETER, sensorEvent.values[0]);
            calculationStepAccelerometer(sensorEvent);
        }
    }

    private void calculationStepAccelerometer(SensorEvent event) {
        prev = lowPassFilter(event.values, prev);
        Accelerometer data = new Accelerometer(prev);
        if (data.R > 10.5f) {
            CURRENT_STATE = ABOVE;
            if (PREVIOUS_STATE != CURRENT_STATE) {
                streakStartTime = System.currentTimeMillis();
                if ((streakStartTime - streakPrevTime) <= 250f) {
                    streakPrevTime = System.currentTimeMillis();
                    return;
                }
                stepCount++;
                WritableMap map = Arguments.createMap();
                map.putDouble(END_TIME, streakStartTime);
                map.putDouble(EVENT_COUNTER, 1);
                map.putDouble(TOTAL_STEP, stepCount);
                map.putDouble(START_TIME, streakPrevTime);
                emitValue(map);
//                Log.e("StepCounter", "EMIT VALUEEE===: " + streakStartTime + " - " + ((float) (streakStartTime - streakPrevTime) / 1000) + " - " + stepCount + " - " + streakPrevTime);
                streakPrevTime = streakStartTime;
            }
            PREVIOUS_STATE = CURRENT_STATE;
        } else if (data.R < 10.5f) {
            CURRENT_STATE = BELOW;
            PREVIOUS_STATE = CURRENT_STATE;
        }
    }

    private float[] lowPassFilter(float[] input, float[] prev) {
        float ALPHA = 0.1f;
        if (input == null || prev == null) {
            return null;
        }
        for (int i = 0; i < input.length; i++) {
            prev[i] = prev[i] + ALPHA * (input[i] - prev[i]);
        }
        return prev;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        mSensorManager.unregisterListener(this);
    }

    private void emitValue(WritableMap params) {
        getReactNativeHost().getReactInstanceManager().getCurrentReactContext()
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(EMIT_EVENT_STEP, params);
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }

}