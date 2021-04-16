package com.mic.bluezone2.services;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@SuppressWarnings("unused")
public class BackgroundActionsPackage implements ReactPackage {
    @Override
    public @NonNull
    List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
        //noinspection ArraysAsListWithZeroOrOneArgument
        return Arrays.<NativeModule>asList(new BackgroundActionsModule(reactContext));
    }

    @Override
    public @NonNull
    List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}