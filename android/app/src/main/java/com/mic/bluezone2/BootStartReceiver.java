package com.mic.bluezone2;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.mic.bluezone2.services.RNBackgroundActionsTask;
import com.mic.bluezone2.util.ConfigNotification;
import com.scan.ServiceTraceCovid;

/**
 * Class chạy khi start lại
 *
 * @author khanhxu
 */
public class BootStartReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        try {
            Log.e("bluezone", "BootStartReceiver");
//            Intent intentStart = new Intent(context, ServiceTraceCovid.class);
            Intent intentStepCounter = new Intent(context, RNBackgroundActionsTask.class);
            boolean isO = ConfigNotification.getIsOpenService(context);
            Log.e("bluezone", "Gia tri luu isOpen: " + isO);
            context.stopService(intentStepCounter);
            // Start service
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
//                context.startForegroundService(intentStart);
                if (ConfigNotification.getIsOpenService(context)) {
                    context.startForegroundService(intentStepCounter);
                }
            } else {
//                context.startService(intentStart);
                if (ConfigNotification.getIsOpenService(context)) {
                    context.startService(intentStepCounter);
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
