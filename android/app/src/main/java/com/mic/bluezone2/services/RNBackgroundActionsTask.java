package com.mic.bluezone2.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.IBinder;
import android.os.PowerManager;
import android.util.Log;
import android.view.View;
import android.widget.RemoteViews;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;
import com.mic.bluezone2.MainActivity;
import com.mic.bluezone2.dao.DatabaseHelper;
import com.mic.bluezone2.model.Accelerometer;
import com.mic.bluezone2.util.ConfigNotification;
import com.mic.bluezone2.util.EmitEvent;
import com.mic.bluezone2.R;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Timer;
import java.util.TimerTask;

final public class RNBackgroundActionsTask extends Service implements SensorEventListener {
    public static ReactApplicationContext reactContext;

    private static final String TAG = RNBackgroundActionsTask.class.getName();

    private static final String EVENT_COUNTER = "stepCounter";
    public static final String EMIT_EVENT_STEP_SAVE = "EMIT_EVENT_STEP_SAVE";
    private static final String EMIT_TIME_WARNING_STEP_TARGET = "EMIT_TIME_WARNING_STEP_TARGET";
    private static final String START_TIME = "startTime";
    private static final String END_TIME = "endTime";
    private static final String TOTAL_STEP = "totalStep";

    public static final int SERVICE_NOTIFICATION_ID = 92963;
    private static final String CHANNEL_ID = "CHANNEL_HEALTH_BLUEZONE";
    private static final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    private SensorManager mSensorManager;
    private DatabaseHelper databaseHelper;

    private Sensor sensorStepCounter;
    private Sensor sensorStepAccelerometer;

    private boolean isSupportStepCounter = true;

    private long lastUpdateTime = System.currentTimeMillis();
    private int lastStepCounter = 0;

    final Handler handler = new Handler();

    private float[] prev = {0f, 0f, 0f};
    private int stepCount = 0;
    private static final int ABOVE = 1;
    private static final int BELOW = 0;
    private static int CURRENT_STATE = 0;
    private static int PREVIOUS_STATE = BELOW;
    private long streakStartTime;
    private long streakPrevTime = System.currentTimeMillis();

    private PowerManager mPowerManger;
    private PowerManager.WakeLock mWakelockSettle;

    @NonNull
    public static Notification buildNotification(@NonNull final Context context) {
        ConfigNotification configNotification = new ConfigNotification(context);

        // Get info
        final String taskTitle = configNotification.getTaskTitle();
        final double currentSteps = configNotification.getCurrentSteps();
        boolean isShowNofi = configNotification.isShowStepTarget();
        double targetSteps = configNotification.getStepsTarget();

        if (targetSteps == 0) {
            targetSteps = 10000;
        }
        final String linkingURI = configNotification.getLinkingURI();
        Intent notificationIntent;
        if (linkingURI != null) {
            notificationIntent = new Intent(Intent.ACTION_VIEW);
            notificationIntent.setData(Uri.parse(linkingURI));
        } else {
            notificationIntent = new Intent(context, MainActivity.class);
        }
        final PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        //custom notification
        RemoteViews notificationLayout = new RemoteViews(context.getPackageName(), R.layout.custom_notification);

        if (isShowNofi) {
            notificationLayout.setViewVisibility(R.id.txtTime, View.VISIBLE);
            notificationLayout.setViewVisibility(R.id.txtNumber, View.VISIBLE);
            notificationLayout.setViewVisibility(R.id.progressBar, View.VISIBLE);
            notificationLayout.setViewVisibility(R.id.txtStepText, View.VISIBLE);
            Date date = new Date();
            notificationLayout.setTextViewText(R.id.txtTime, formatter.format(date));
            notificationLayout.setTextViewText(R.id.txtNumber, "" + ((int) currentSteps) + "/" + ((int) targetSteps));
            int tmp = (int) (((float) currentSteps / targetSteps) * 100);
            notificationLayout.setProgressBar(R.id.progressBar, 100, tmp, false);
        } else {
            notificationLayout.setViewVisibility(R.id.txtTime, View.GONE);
            notificationLayout.setViewVisibility(R.id.txtNumber, View.GONE);
            notificationLayout.setViewVisibility(R.id.progressBar, View.GONE);
            notificationLayout.setViewVisibility(R.id.txtStepText, View.GONE);
        }


        Notification notification = new NotificationCompat.Builder(context, CHANNEL_ID)
                .setSmallIcon(R.mipmap.icon_bluezone)
                .setContentTitle(taskTitle)
                .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
                .setCustomContentView(notificationLayout)
                .setContentIntent(contentIntent)
                .setCustomBigContentView(notificationLayout)
                .setAutoCancel(false)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MAX)
                .build();
        return notification;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        Log.e(TAG, "onCreate Service");

        mPowerManger = (PowerManager) getSystemService(Context.POWER_SERVICE);
        mWakelockSettle = mPowerManger.newWakeLock(PowerManager.PARTIAL_WAKE_LOCK, "bluezone2:ALARM");
        mWakelockSettle.acquire();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Log.e(TAG, "onStartCommand service");
        databaseHelper = new DatabaseHelper(getApplicationContext());

        Context context = getApplicationContext();

        ConfigNotification configNotification = new ConfigNotification(this);
        createNotificationChannel(configNotification.getTaskTitle(), configNotification.getTaskDesc());

        // Create the notification
        final Notification notification = buildNotification(context);
        startForeground(SERVICE_NOTIFICATION_ID, notification);

        mSensorManager = (SensorManager)
                context.getSystemService(Context.SENSOR_SERVICE);

        sensorStepCounter = mSensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        sensorStepAccelerometer = mSensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);

        boolean check = false;

        if (sensorStepCounter == null) {
            check = true;
        } else {
            mSensorManager.registerListener(this, sensorStepCounter, SensorManager.SENSOR_DELAY_FASTEST);
        }

        if (check) {
            mSensorManager.registerListener(this, sensorStepAccelerometer, SensorManager.SENSOR_DELAY_FASTEST);
        }

        backgroundRuntime();

        return START_STICKY;
    }

    private void updateNotification() {
        final Notification notification = RNBackgroundActionsTask.buildNotification(getApplicationContext());

        final NotificationManager notificationManager = (NotificationManager) getApplicationContext().getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(RNBackgroundActionsTask.SERVICE_NOTIFICATION_ID, notification);
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
            calculationStepCounter(sensorEvent);
        }

        if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            calculationStepAccelerometer(sensorEvent);
        }
    }

    /**
     * Tính toán dựa theo stepcounter sensor
     */
    private void calculationStepCounter(SensorEvent sensorEvent) {
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
            // todo: save to database step counter
            saveStepsToDatabase(map.getDouble(START_TIME), map.getDouble(END_TIME), map.getInt(EVENT_COUNTER));
            emitValue(map);
        }
        lastStepCounter = numberStep;
        lastUpdateTime = curTime;
    }

    private void backgroundRuntime() {
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            public void run() {
                handler.post(() -> {
                    Date current = new Date();
                    long currentTime = current.getTime() / 1000;
                    SimpleDateFormat simpleDateFormatDay = new SimpleDateFormat("dd/MM/yyyy");
                    SimpleDateFormat simpleDateFormatHour = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss");
                    Date time7PmDate = null;
                    try {
                        time7PmDate = simpleDateFormatHour.parse(simpleDateFormatDay.format(current) + " 19:00:00");
                    } catch (ParseException e) {
                        e.printStackTrace();
                    }//
                    long time7Pm = time7PmDate.getTime() / 1000;

                    Log.e(TAG, "Dang chay :::: " + currentTime + "  - " + time7Pm);
                    if ((currentTime - time7Pm) >= 0 && (currentTime - time7Pm) <= 9) {
                        Log.e(TAG, "Send event push notification warning step counter");
                        EmitEvent.sendEvent(reactContext,
                                EMIT_TIME_WARNING_STEP_TARGET,
                                Arguments.createMap());
                    }
                });
            }
        };
        timer.schedule(timerTask, 0, 10000);
    }

    /**
     * Tính toán dựa theo accelerometer sensor
     */
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
                if (streakStartTime - streakPrevTime > 1000) {
                    streakPrevTime = streakStartTime - 1000;
                }
                map.putDouble(START_TIME, streakPrevTime);
                emitValue(map);
                // todo: save stepcounter
                saveStepsToDatabase(streakPrevTime, streakStartTime, 1);
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
        Log.e(TAG, "onDestroy");
        mSensorManager.unregisterListener(this);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    /**
     * Send emit event toi tang JS
     */
    private void emitValue(WritableMap params) {
        Log.e(TAG, "stepCount: " + params);

        EmitEvent.sendEvent(reactContext,
                EMIT_EVENT_STEP_SAVE,
                params);
    }

    private void saveStepsToDatabase(double startTime, double endTime, int steps) {
        if (databaseHelper != null) {
            databaseHelper.addStepCounter(startTime, endTime, steps);
            updateNotification();
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int i) {

    }
}