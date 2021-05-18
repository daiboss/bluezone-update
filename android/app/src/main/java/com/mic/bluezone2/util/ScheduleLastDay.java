package com.mic.bluezone2.util;

import android.app.Notification;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Handler;

import com.mic.bluezone2.dao.DatabaseHelper;
import com.mic.bluezone2.services.RNBackgroundActionsTask;

import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.Timer;
import java.util.TimerTask;

public class ScheduleLastDay {
    private static final String TAG = ScheduleLastDay.class.getName();

    private Context context;
    private DatabaseHelper databaseHelper;

    final Handler handler = new Handler();

    public ScheduleLastDay(Context context) {
        this.context = context;
        this.databaseHelper = new DatabaseHelper(context);
    }

    public void scheduleNewDay() {
        Timer timer = new Timer();
        TimerTask timerTask = new TimerTask() {
            public void run() {
                handler.post(() -> {
                    ConfigNotification configNotification = new ConfigNotification(context);

                    Calendar currentTime = new GregorianCalendar();
                    currentTime.set(Calendar.HOUR_OF_DAY, 0);
                    currentTime.set(Calendar.MINUTE, 0);
                    currentTime.set(Calendar.SECOND, 0);
                    currentTime.set(Calendar.MILLISECOND, 0);

                    long currentDay = currentTime.getTimeInMillis();

                    long lastSave = currentTime.getTimeInMillis();

                    if (lastSave != currentDay) {
                        handleNewDay();
                    }
                    configNotification.saveLastHistory(currentDay);
                });
            }
        };
        timer.schedule(timerTask, 60000);
    }

    public void handleNewDay() {
        if (ConfigNotification.getIsOpenService(context)) {
            final Notification notification = RNBackgroundActionsTask.buildNotification(context);
            final NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            notificationManager.notify(RNBackgroundActionsTask.SERVICE_NOTIFICATION_ID, notification);
        }
    }
}
