package com.mic.bluezone2.util;

import android.content.Context;
import android.content.SharedPreferences;

import com.mic.bluezone2.dao.DatabaseHelper;

import java.text.SimpleDateFormat;
import java.util.Date;

public class ConfigNotification {
    private static final String SPNAME_NOTIFICATION = "SPNAME_NOTIFICATION";
    private static final String KEY_STEP_TARGET = "KEY_STEP_TARGET";
    private static final String KEY_ISHOW_TARGET = "KEY_ISHOW_TARGET";
    private static final String KEY_FIRST_TIME = "KEY_FIRST_TIME";
    private static final String KEY_LAST_SAVE = "KEY_LAST_SAVE";
    private static final String KEY_IS_OPEN_SERVICE = "KEY_IS_OPEN_SERVICE";

    private boolean isShowStepTarget = true;
    private int stepsTarget = 10000;
    private int currentSteps = 0;
    private String taskTitle = "Bluezone - Tiện ích sức khoẻ";
    private String taskDesc = "Bluezone đếm bước chân";
    private double lastSaveHistory = 0d;
    private String linkingURI = "mic.bluezone://bluezone/HomeStack/stepCount";
    private String firstTime = null;

    private SharedPreferences sharedPreferences;

    private Context context;

    public ConfigNotification(Context context) {
        this.context = context;
        initData();
    }

    private void initData() {
        if (context != null) {
            sharedPreferences = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
            this.stepsTarget = sharedPreferences.getInt(KEY_STEP_TARGET, 10000);
            this.isShowStepTarget = sharedPreferences.getBoolean(KEY_ISHOW_TARGET, true);

            firstTime = sharedPreferences.getString(KEY_FIRST_TIME, null);
            if (firstTime == null) {
                SharedPreferences.Editor editor = sharedPreferences.edit();
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
                Date date = new Date();
                editor.putString(KEY_FIRST_TIME, format.format(date));
                this.firstTime = format.format(date);
            }

            DatabaseHelper databaseHelper = new DatabaseHelper(context);
            this.currentSteps = databaseHelper.getTotalStepToDay();
        }
    }

    public void saveLastHistory(long lastTime) {
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.putLong(KEY_LAST_SAVE, lastTime);
        editor.commit();
        this.lastSaveHistory = lastTime;
    }

    public static void toggleStepTarget(boolean isShow, Context context) {
        SharedPreferences pref = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
        SharedPreferences.Editor editor = pref.edit();
        editor.putBoolean(KEY_ISHOW_TARGET, isShow);
        editor.commit();
    }

    public static boolean getIsShowStepTarget(Context context) {
        SharedPreferences pref = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
        return pref.getBoolean(KEY_ISHOW_TARGET, true);
    }

    public static void toggleOnOffService(boolean isOpen, Context context) {
        SharedPreferences pref = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
        SharedPreferences.Editor editor = pref.edit();
        editor.putBoolean(KEY_IS_OPEN_SERVICE, isOpen);
        editor.commit();
    }

    public static void setStepTarget(int stepTarget, Context context) {
        SharedPreferences pref = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
        SharedPreferences.Editor editor = pref.edit();
        editor.putInt(KEY_STEP_TARGET, stepTarget);
        editor.commit();
    }

    public static boolean getIsOpenService(Context context) {
        SharedPreferences pref = context.getSharedPreferences(SPNAME_NOTIFICATION, 0);
        return pref.getBoolean(KEY_IS_OPEN_SERVICE, true);
    }

    public boolean isShowStepTarget() {
        return isShowStepTarget;
    }

    public void setShowStepTarget(boolean showStepTarget) {
        isShowStepTarget = showStepTarget;
    }

    public int getStepsTarget() {
        return stepsTarget;
    }

    public void setStepsTarget(int stepsTarget) {
        this.stepsTarget = stepsTarget;
    }

    public int getCurrentSteps() {
        return currentSteps;
    }

    public void setCurrentSteps(int currentSteps) {
        this.currentSteps = currentSteps;
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public String getTaskDesc() {
        return taskDesc;
    }

    public void setTaskDesc(String taskDesc) {
        this.taskDesc = taskDesc;
    }

    public String getLinkingURI() {
        return linkingURI;
    }

    public void setLinkingURI(String linkingURI) {
        this.linkingURI = linkingURI;
    }

    public SharedPreferences getSharedPreferences() {
        return sharedPreferences;
    }

    public void setSharedPreferences(SharedPreferences sharedPreferences) {
        this.sharedPreferences = sharedPreferences;
    }

    public double getLastSaveHistory() {
        return lastSaveHistory;
    }

    public void setLastSaveHistory(double lastSaveHistory) {
        this.lastSaveHistory = lastSaveHistory;
    }

    public String getFirstTime() {
        return firstTime;
    }

    public void setFirstTime(String firstTime) {
        this.firstTime = firstTime;
    }

    public Context getContext() {
        return context;
    }

    public void setContext(Context context) {
        this.context = context;
    }
}
