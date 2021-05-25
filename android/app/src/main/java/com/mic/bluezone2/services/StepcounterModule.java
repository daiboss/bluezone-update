package com.mic.bluezone2.services;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.mic.bluezone2.dao.DatabaseHelper;
import com.mic.bluezone2.model.StepCounter;
import com.mic.bluezone2.model.StepHistory;
import com.mic.bluezone2.util.ConvertArrayToWritableMap;

import java.util.List;

@SuppressWarnings("WeakerAccess")
public class StepcounterModule extends ReactContextBaseJavaModule {

    private static final String TAG = "RNStepCounterModule";
    private final ReactContext reactContext;
    private static ReactApplicationContext reactContextStatic;

    private DatabaseHelper databaseHelper;

    public StepcounterModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContextStatic = reactContext;
        databaseHelper = new DatabaseHelper(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return TAG;
    }

    @ReactMethod
    public void getAllStepCounter(Promise promise) {
        if (databaseHelper != null) {
            List<StepCounter> listResults = databaseHelper.getListStepsAll();
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepCounter(listResults);
            promise.resolve(res);
            return;
        }
        promise.resolve("");
    }

    @ReactMethod
    public void getStepsToday(Promise promise) {
        if (databaseHelper != null) {
            List<StepCounter> listResults = databaseHelper.getListStepDay();
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepCounter(listResults);
            promise.resolve(res);
            return;
        }
        promise.resolve(new WritableNativeArray());
    }

    @ReactMethod
    public void getStepsYesterday(Promise promise) {
        if (databaseHelper != null) {
            List<StepCounter> listResults = databaseHelper.getListStepDayBefore();
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepCounter(listResults);
            promise.resolve(res);
            return;
        }
        promise.resolve("");
    }

    @ReactMethod
    public void getListHistory(double start, double end, Promise promise) {
        if (databaseHelper != null) {
            List<StepHistory> listResults = databaseHelper.getListHistory(start, end);
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepHistory(listResults);
            promise.resolve(res);
            return;
        }
        promise.resolve("");
    }

    @ReactMethod
    public void saveHistoryDay(double time, String valueSave, Promise promise) {
        if (databaseHelper != null) {
            databaseHelper.addHistory(time, valueSave);
        }
        promise.resolve("");
    }

    @ReactMethod
    public void removeAllStepDay(double start, double end, Promise promise) {
        if (databaseHelper != null) {
            databaseHelper.removeStepFromTo(start, end);
        }
        promise.resolve("");
    }

    @ReactMethod
    public void removeAllHistory(Promise promise) {
        if (databaseHelper != null) {
            databaseHelper.removeAllHistory();
        }
        promise.resolve("");
    }

    @ReactMethod
    public void updateTypeNotification() {
        WritableMap params = Arguments.createMap();
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EMIT_EVENT_STEP", params);
    }

    @ReactMethod
    public void updateStepTargetSuccess() {
        WritableMap params = Arguments.createMap();
        this.reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("EMIT_EVENT_STEP_TARGET", params);
    }

    @ReactMethod
    public void getListStepsBefore(Promise promise){
        if (databaseHelper != null) {
            List<StepCounter> listStep = databaseHelper.getListStepsBefore();
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepCounter(listStep);
            promise.resolve(res);
            return;
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void getListStartDateHistory(Promise promise){
        if (databaseHelper != null) {
            List<StepHistory> listStep = databaseHelper.getListStartDateHistory();
            WritableArray res = ConvertArrayToWritableMap.convertToWritableMapStepHistory(listStep);
            promise.resolve(res);
            return;
        }
        promise.resolve(null);
    }

    @ReactMethod
    public void getCountStepsToday(Promise promise){
        if (databaseHelper != null) {
            int listStep = databaseHelper.getTotalStepToDay();
            promise.resolve(listStep);
            return;
        }
        promise.resolve(null);
    }
}