package com.mic.bluezone2.dao;

import android.content.Context;
import android.util.Log;

import com.mic.bluezone2.database.StepCounterDatabase;
import com.mic.bluezone2.model.StepCounter;
import com.mic.bluezone2.model.StepHistory;
import com.mic.bluezone2.util.ConfigNotification;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

public class DatabaseHelper {
    private static final String TAG = DatabaseHelper.class.getName();
    private Context context;

    private StepCounterDatabase stepCounterDatabase;

    public DatabaseHelper(Context context) {
        stepCounterDatabase = StepCounterDatabase.getInstance(context);
        this.context = context;
    }

    // Thêm giá trị bước đi được
    public void addStepCounter(double start, double end, int steps) {
        try {
            StepCounter stepCounter = new StepCounter(start, end, steps);
            stepCounterDatabase.stepCounterDAO().insert(stepCounter);
        } catch (Exception e) {
            Log.e(TAG, "addStepCounter error: " + e.getMessage());
        }
    }

    // Lấy danh sách bước đi trong ngày
    public List<StepCounter> getListStepDay() {
        try {
            Calendar currentTime = new GregorianCalendar();
            currentTime.set(Calendar.HOUR_OF_DAY, 0);
            currentTime.set(Calendar.MINUTE, 0);
            currentTime.set(Calendar.SECOND, 0);
            currentTime.set(Calendar.MILLISECOND, 0);

            double start = currentTime.getTimeInMillis();

            currentTime.set(Calendar.HOUR_OF_DAY, 23);
            currentTime.set(Calendar.MINUTE, 59);
            currentTime.set(Calendar.SECOND, 59);
            currentTime.set(Calendar.MILLISECOND, 59);
            double end = currentTime.getTimeInMillis();

            return stepCounterDatabase.stepCounterDAO().getListStepDay(start, end);
        } catch (Exception e) {
            Log.e(TAG, "getListStepDay error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    public int getTotalStepToDay() {
        try {
            Calendar currentTime = new GregorianCalendar();
            currentTime.set(Calendar.HOUR_OF_DAY, 0);
            currentTime.set(Calendar.MINUTE, 0);
            currentTime.set(Calendar.SECOND, 0);
            currentTime.set(Calendar.MILLISECOND, 0);

            double start = currentTime.getTimeInMillis();

            currentTime.set(Calendar.HOUR_OF_DAY, 23);
            currentTime.set(Calendar.MINUTE, 59);
            currentTime.set(Calendar.SECOND, 59);
            currentTime.set(Calendar.MILLISECOND, 59);
            double end = currentTime.getTimeInMillis();

            return stepCounterDatabase.stepCounterDAO().getTotalStepDay(start, end);
        } catch (Exception e) {
            Log.e(TAG, "getTotalStepToDay error: " + e.getMessage());
            return 0;
        }
    }

    // lấy tất cả các bước đi hôm qua
    public List<StepCounter> getListStepDayBefore() {
        try {
            Calendar currentTime = new GregorianCalendar();
            currentTime.set(Calendar.HOUR_OF_DAY, 0);
            currentTime.set(Calendar.MINUTE, 0);
            currentTime.set(Calendar.SECOND, 0);
            currentTime.set(Calendar.MILLISECOND, 0);
            currentTime.add(Calendar.DATE, -1);

            double start = currentTime.getTimeInMillis();

            currentTime.set(Calendar.HOUR_OF_DAY, 23);
            currentTime.set(Calendar.MINUTE, 59);
            currentTime.set(Calendar.SECOND, 59);
            currentTime.set(Calendar.MILLISECOND, 59);
            double end = currentTime.getTimeInMillis();

            return stepCounterDatabase.stepCounterDAO().getListStepDay(start, end);

        } catch (Exception e) {
            Log.e(TAG, "getListStepDayBefore error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // lấy tất cả các bước đi từ ngày đến ngày
    public List<StepCounter> getListStepDayFromTo(double start, double end) {
        try {
            return stepCounterDatabase.stepCounterDAO().getListStepDay(start, end);
        } catch (Exception e) {
            Log.e(TAG, "getListStepDayBefore error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // lấy tất cả các bước đi từ trước chưa lưu
    public List<StepCounter> getListStepsBefore() {
        try {
            Calendar currentTime = new GregorianCalendar();
            currentTime.set(Calendar.HOUR_OF_DAY, 0);
            currentTime.set(Calendar.MINUTE, 0);
            currentTime.set(Calendar.SECOND, 0);
            currentTime.set(Calendar.MILLISECOND, 0);

            double start = currentTime.getTimeInMillis();

            return stepCounterDatabase.stepCounterDAO().getListStepBeforeDay(start);

        } catch (Exception e) {
            Log.e(TAG, "getListStepsBefore error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // lấy tất cả các bước đi
    public List<StepCounter> getListStepsAll() {
        try {
            return stepCounterDatabase.stepCounterDAO().getListStepsAll();
        } catch (Exception e) {
            Log.e(TAG, "getListStepsAll error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // xoá hết số bước đi từ start đến end
    public void removeStepFromTo(double start, double end) {
        try {
            stepCounterDatabase.stepCounterDAO().removeAllStepDay(start, end);
        } catch (Exception e) {
            Log.e(TAG, "removeStepFromTo error: " + e.getMessage());
        }
    }

    // Xoá hết só bước đi
    public void removeAllStep() {
        try {
            stepCounterDatabase.stepCounterDAO().removeAllStep();
        } catch (
                Exception e) {
            Log.e(TAG, "removeAllStep error: " + e.getMessage());
        }

    }

    // Xoá hết số bước đi từ ngày tới ngày
    public void removeAllStepDay() {
        try {
            stepCounterDatabase.stepCounterDAO().removeAllStep();
        } catch (Exception e) {
            Log.e(TAG, "removeAllStep error: " + e.getMessage());
        }
    }

    ///-================/////

    // Lấy danh sách lịch sử từ ngày tới ngày
    public List<StepHistory> getListHistory(double start, double end) {
        try {
            return stepCounterDatabase.stepHistoryDAO().getListHistory(start, end);
        } catch (Exception e) {
            Log.e(TAG, "getListHistory error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // Thêm vào lịch sử, nếu tồn tại sẽ update giá trị mới nhất
    public void addHistory(double valueTime, String value) {
        try {
            Log.e(TAG, "ADDHISTORY  time: " + valueTime + " - " + value);
            StepHistory checkExist = stepCounterDatabase.stepHistoryDAO().checkExistHistory(valueTime);
            if (checkExist != null) {
                stepCounterDatabase.stepHistoryDAO().updateHistory(checkExist.getId(), value);
            } else {
                StepHistory stepHistory = new StepHistory(valueTime, value);
                stepCounterDatabase.stepHistoryDAO().insert(stepHistory);
            }
        } catch (Exception e) {
            Log.e(TAG, "addHistory error: " + e.getMessage());
        }
    }

    // Lấy danh lịch sử của những ngày trước ngày hôm nay
    public List<StepHistory> getListStartDateHistory() {
        try {
            Calendar currentTime = new GregorianCalendar();
            currentTime.set(Calendar.HOUR_OF_DAY, 0);
            currentTime.set(Calendar.MINUTE, 0);
            currentTime.set(Calendar.SECOND, 0);
            currentTime.set(Calendar.MILLISECOND, 0);

            return stepCounterDatabase.stepHistoryDAO().getListAfterDateHistory(currentTime.getTimeInMillis());
        } catch (Exception e) {
            Log.e(TAG, "getListStartDateHistory error: " + e.getMessage());
            return Collections.emptyList();
        }
    }

    // Xoá hết lịch sử trong db
    public void removeAllHistory() {
        try {
            stepCounterDatabase.stepHistoryDAO().removeAllHistory();
        } catch (Exception e) {
            Log.e(TAG, "removeAllHistory error: " + e.getMessage());
        }
    }
}
