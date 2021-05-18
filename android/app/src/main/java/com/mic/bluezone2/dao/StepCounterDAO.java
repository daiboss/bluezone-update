package com.mic.bluezone2.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.mic.bluezone2.model.StepCounter;

import java.util.List;

@Dao
public interface StepCounterDAO {
    // Thêm giá trị bước đi được
    @Insert(onConflict = OnConflictStrategy.IGNORE)
    void insert(StepCounter stepCounter);

    // Lấy danh sách bước đi trong từ start đến end
    @Query("SELECT * FROM stepcounter where starttime >= :startDay and starttime <= :endDay")
    List<StepCounter> getListStepDay(double startDay, double endDay);

    // Lấy tổng số bước từ start đến end
    @Query("SELECT SUM(step) FROM stepcounter where starttime >= :startDay and starttime <= :endDay")
    int getTotalStepDay(double startDay, double endDay);

    // Lấy danh sách bước đi trước ngày
    @Query("SELECT * FROM stepcounter where starttime < :startDay")
    List<StepCounter> getListStepBeforeDay(double startDay);

    // lấy tất cả các bước đi
    @Query("SELECT * FROM stepcounter")
    List<StepCounter> getListStepsAll();

    // Xoá hết só bước đi
    @Query("DELETE FROM stepcounter")
    void removeAllStep();

    // Xoá hết số bước đi từ ngày tới ngày
    @Query("DELETE FROM stepcounter where starttime >= :fromDay and starttime <= :endDay")
    void removeAllStepDay(double fromDay, double endDay);

}
