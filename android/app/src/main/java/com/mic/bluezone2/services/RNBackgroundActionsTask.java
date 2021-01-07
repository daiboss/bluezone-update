package com.mic.bluezone2.services;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.widget.RemoteViews;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.facebook.react.HeadlessJsTaskService;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.jstasks.HeadlessJsTaskConfig;
import com.mic.bluezone2.R;

import java.text.SimpleDateFormat;
import java.util.Date;

final public class RNBackgroundActionsTask extends HeadlessJsTaskService {

    public static final int SERVICE_NOTIFICATION_ID = 92963;
    private static final String CHANNEL_ID = "CHANNEL_HEALTH_BLUEZONE";
    private static final SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy");
    private static final Date date = new Date();

    @NonNull
    public static Notification buildNotification(@NonNull final ReactContext context, @NonNull final BackgroundTaskOptions bgOptions) {
        // Get info
        final String taskTitle = bgOptions.getTaskTitle();
        final double currentSteps = bgOptions.getCurrentSteps();
        double targetSteps = bgOptions.getStepsTarget();
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

        notificationLayout.setTextViewText(R.id.txtTime, formatter.format(date));
        notificationLayout.setTextViewText(R.id.txtNumber, "" + ((int) currentSteps) + "/" + ((int) targetSteps));
        int tmp = (int) (((float) currentSteps / targetSteps) * 100);
        notificationLayout.setProgressBar(R.id.progressBar, 100, tmp, false);
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

//        final NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
//                .setContentTitle(taskTitle)
//                .setContentText(taskDesc)
//                .setSmallIcon(iconInt)
//                .setContentIntent(contentIntent)
//                .setOngoing(true)
//                .setPriority(NotificationCompat.PRIORITY_MIN)
//                .setColor(color);
//
//        final Bundle progressBarBundle = bgOptions.getProgressBar();
//        if (progressBarBundle != null) {
//            final int progressMax = (int) Math.floor(progressBarBundle.getDouble("max"));
//            final int progressCurrent = (int) Math.floor(progressBarBundle.getDouble("value"));
//            final boolean progressIndeterminate = progressBarBundle.getBoolean("indeterminate");
//            builder.setProgress(progressMax, progressCurrent, progressIndeterminate);
//        }
//
//        return builder.build();
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
        final BackgroundTaskOptions bgOptions = new BackgroundTaskOptions(extras);
        createNotificationChannel(bgOptions.getTaskTitle(), bgOptions.getTaskDesc()); // Necessary creating channel for API 26+
        // Create the notification
        final Notification notification = buildNotification(getReactNativeHost().getReactInstanceManager().getCurrentReactContext(), bgOptions);
        startForeground(SERVICE_NOTIFICATION_ID, notification);
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
}