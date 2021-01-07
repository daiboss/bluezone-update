package com.mic.bluezone2;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class StepCounterModule extends ReactContextBaseJavaModule {
    private ReactContext context;
    private final String TAG = "RNBluezoneStepCounter";
    private MyStepsCounter myStepsCounter;

    StepCounterModule(ReactApplicationContext context) {
        super(context);
        this.context = context;
        myStepsCounter = new MyStepsCounter(context, context.getCurrentActivity());
    }

    @NonNull
    @Override
    public String getName() {
        return TAG;
    }
}
