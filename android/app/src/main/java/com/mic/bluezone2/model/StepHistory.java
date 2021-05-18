package com.mic.bluezone2.model;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "historyStepcounter")
public class StepHistory {
    @PrimaryKey(autoGenerate = true)
    @NonNull
    @ColumnInfo(name = "id")
    private int id;

    @ColumnInfo(name = "starttime")
    private double starttime;

    @ColumnInfo(name = "resultStep")
    private String resultStep;

    public StepHistory() {
    }

    public StepHistory(double starttime, String resultStep) {
        this.starttime = starttime;
        this.resultStep = resultStep;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public double getStarttime() {
        return starttime;
    }

    public void setStarttime(double starttime) {
        this.starttime = starttime;
    }

    public String getResultStep() {
        return resultStep;
    }

    public void setResultStep(String resultStep) {
        this.resultStep = resultStep;
    }
}
