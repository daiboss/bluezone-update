package com.mic.bluezone2.schedule;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Log;

import androidx.core.app.NotificationCompat;

import com.mic.bluezone2.R;

import static com.mic.bluezone2.services.RNBackgroundActionsTask.CHANNEL_ID;

public class NotificationStepTarget {
    private SharedPreferences sharedPreferences;
    private SharedPreferences.Editor editor;
    private final static String NAME_TARGET = "NAME_TARGET";
    private final static String SAVE_IS_NOTI = "SAVE_IS_NOTI";
    private final static String LAST_DAY_SAVE = "LAST_DAY_SAVE";
    private final static String STEP_TARGET = "STEP_TARGET";
    private Context context;

    public NotificationStepTarget(Context context) {
        this.context = context;
        sharedPreferences = context.getSharedPreferences(NAME_TARGET, 0);
        editor = sharedPreferences.edit();
    }

    public boolean checkDayExist(String day) {
        String lastSave = sharedPreferences.getString(LAST_DAY_SAVE, "");
        if (!lastSave.equals(day)) {
            editor.putString(LAST_DAY_SAVE, day);
            editor.commit();
            return false;
        }
        return true;
    }

    public void saveIsNoti(boolean isNoti) {
        editor.putBoolean(SAVE_IS_NOTI, isNoti);
        editor.commit();
    }

    public boolean isNoti() {
        return sharedPreferences.getBoolean(SAVE_IS_NOTI, false);
    }

    public void pushNotificationWarning(int steps) {
        int target = getStepTarget();
        if (steps >= target) {
            return;
        }
        Log.e("NotificationStepTarget", "Target : " + steps + " - " + target);
        Intent notificationIntent = new Intent(Intent.ACTION_VIEW);
        notificationIntent.setData(Uri.parse("mic.bluezone://bluezone/HomeStack/stepCount"));
        final PendingIntent contentIntent = PendingIntent.getActivity(context, 0, notificationIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        Notification.Builder builder = new Notification.Builder(context)
                .setContentTitle("Sức khoẻ")
                .setContentText("Bạn còn " + (target - steps) + " bước để hoàn thành mục tiêu ngày hôm nay")
                .setSmallIcon(R.mipmap.icon_bluezone_service)
                .setContentIntent(contentIntent)
                .setAutoCancel(true)
                .setStyle(new Notification.BigTextStyle().bigText("Bạn còn " + (target - steps) + " bước để hoàn thành mục tiêu ngày hôm nay"));

        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
            builder.setChannelId(CHANNEL_ID);
        }
        Notification notify = builder.build();


        final NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        notificationManager.notify(92964, notify);
    }

    public void setStepTarget(int stepTarget) {
        editor.putInt(STEP_TARGET, stepTarget);
        editor.commit();
    }

    private int getStepTarget() {
        return sharedPreferences.getInt(STEP_TARGET, 10000);
    }
}
