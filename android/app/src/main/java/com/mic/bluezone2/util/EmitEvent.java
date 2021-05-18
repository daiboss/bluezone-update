package com.mic.bluezone2.util;

import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class EmitEvent {
    private static final String TAG = EmitEvent.class.getName();

    public static void sendEvent(final ReactContext context, final String eventName, Object body) {
        if (context != null) {
            context
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, body);
        } else {
            Log.d(TAG, "Missing context - cannot send event!");
        }
    }
}
