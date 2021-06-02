package com.mic.bluezone2.schedule;


import android.content.Context;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.work.Data;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import com.facebook.react.bridge.Arguments;
import com.mic.bluezone2.services.RNBackgroundActionsTask;
import com.mic.bluezone2.util.EmitEvent;

import static com.mic.bluezone2.services.RNBackgroundActionsTask.EMIT_TIME_WARNING_STEP_TARGET;
import static com.mic.bluezone2.services.RNBackgroundActionsTask.reactContext;

public class ScheduleTimer extends Worker {
    private static final String WORK_RESULT = "ScheduleTimer7PM";

    public ScheduleTimer(@NonNull Context context, @NonNull WorkerParameters workerParams) {
        super(context, workerParams);
    }

    @NonNull
    @Override
    public Result doWork() {
        Log.e(WORK_RESULT, "DA 7H ROI, DAY MA GAY");
        if(RNBackgroundActionsTask.reactContext != null) {
            Log.e(WORK_RESULT, "KHONGNULLLLL");
            EmitEvent.sendEvent(reactContext, EMIT_TIME_WARNING_STEP_TARGET, Arguments.createMap());
        }
        Data outputData = new Data.Builder().putString(WORK_RESULT, "Jobs Finished at 7pm").build();
        return Result.success(outputData);
    }
}