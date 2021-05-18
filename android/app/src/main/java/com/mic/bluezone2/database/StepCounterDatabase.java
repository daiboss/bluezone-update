package com.mic.bluezone2.database;

import android.content.Context;

import androidx.room.Database;
import androidx.room.Room;
import androidx.room.RoomDatabase;

import com.mic.bluezone2.dao.StepCounterDAO;
import com.mic.bluezone2.dao.StepHistoryDAO;
import com.mic.bluezone2.model.StepCounter;
import com.mic.bluezone2.model.StepHistory;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@Database(entities = {StepHistory.class, StepCounter.class}, version = 1, exportSchema = false)
public abstract class StepCounterDatabase extends RoomDatabase {
    public abstract StepCounterDAO stepCounterDAO();

    public abstract StepHistoryDAO stepHistoryDAO();

    private static final int NUMBER_OF_THREADS = 4;
    public static final ExecutorService databaseWriteExecutor =
            Executors.newFixedThreadPool(NUMBER_OF_THREADS);

    private static StepCounterDatabase instance;

    public static StepCounterDatabase getInstance(final Context context) {
        if (instance == null) {
            synchronized (StepCounterDatabase.class) {
                if (instance == null) {
                    instance = Room.databaseBuilder(context.getApplicationContext(),
                            StepCounterDatabase.class, "step_database")
                            .allowMainThreadQueries()
                            .build();
                }
            }
        }
        return instance;
    }
}
