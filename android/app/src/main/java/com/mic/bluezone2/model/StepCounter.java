package com.mic.bluezone2.model;

import androidx.annotation.NonNull;
import androidx.room.ColumnInfo;
import androidx.room.Entity;
import androidx.room.PrimaryKey;

@Entity(tableName = "stepcounter")
public class StepCounter {
    @PrimaryKey(autoGenerate = true)
    @NonNull
    @ColumnInfo(name = "id")
    private int id;

    @ColumnInfo(name = "starttime")
    private double starttime;

    @ColumnInfo(name = "endtime")
    private double endtime;

    @ColumnInfo(name = "step")
    private int step;

    public StepCounter(){}

    public StepCounter(double starttime, double endtime, int step) {
        this.starttime = starttime;
        this.endtime = endtime;
        this.step = step;
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

    public double getEndtime() {
        return endtime;
    }

    public void setEndtime(double endtime) {
        this.endtime = endtime;
    }

    public int getStep() {
        return step;
    }

    public void setStep(int step) {
        this.step = step;
    }
}
