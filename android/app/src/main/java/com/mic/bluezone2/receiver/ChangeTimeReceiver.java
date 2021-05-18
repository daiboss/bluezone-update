package com.mic.bluezone2.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import com.mic.bluezone2.util.ScheduleLastDay;


public class ChangeTimeReceiver extends BroadcastReceiver {
    private static final String TAG = ChangeTimeReceiver.class.getName();

    @Override
    public void onReceive(Context context, Intent intent) {
        Log.e(TAG, "Co su thay doi gio he thong");
        ScheduleLastDay scheduleLastDay = new ScheduleLastDay(context);
        scheduleLastDay.handleNewDay();
    }
}
