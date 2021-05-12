package com.mic.bluezone2;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

import com.mic.bluezone2.services.RNBackgroundActionsTask;
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
            Intent intentStart = new Intent(context, ServiceTraceCovid.class);

            Intent in2 = new Intent(context, RNBackgroundActionsTask.class);


            // Start service
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intentStart);
                context.startForegroundService(in2);
            } else {
                context.startService(intentStart);
                context.startService(in2);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
