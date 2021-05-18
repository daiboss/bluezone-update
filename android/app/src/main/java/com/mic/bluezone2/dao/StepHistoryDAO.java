package com.mic.bluezone2.dao;

import androidx.room.Dao;
import androidx.room.Insert;
import androidx.room.OnConflictStrategy;
import androidx.room.Query;

import com.mic.bluezone2.model.StepHistory;

import java.util.List;

@Dao
public interface StepHistoryDAO {
    // Thêm vào lịch sử
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    void insert(StepHistory stepHistory);

    @Query("UPDATE historyStepcounter SET resultStep = :value WHERE id = :id")
    void updateHistory(int id, String value);

    // Lấy danh sách lịch sử từ ngày tới ngày
    @Query("SELECT * FROM historyStepcounter where starttime >= :fromDate and starttime <= :toDate order by starttime")
    List<StepHistory> getListHistory(double fromDate, double toDate);

    // Lấy danh lịch sử của những ngày trước ngày hôm nay
    @Query("SELECT * FROM historyStepcounter where starttime < :currentTime order by starttime")
    List<StepHistory> getListAfterDateHistory(double currentTime);

    // kiểm tra lịch sử ngày này đã lưu hay chưa
    @Query("SELECT * FROM historyStepcounter WHERE starttime = :valueTime")
    StepHistory checkExistHistory(double valueTime);

    // Xoá hết lịch sử trong db
    @Query("DELETE FROM historyStepcounter")
    void removeAllHistory();

    // lấy danh sách startTime ở trên db
    @Query("SELECT starttime FROM historyStepcounter order by starttime")
    List<Double> getListStartTime();
}
