package com.example.quizsystem.repository;

import com.example.quizsystem.entity.Attempt;
import com.example.quizsystem.entity.AttemptStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUserIdOrderByStartTimeDesc(Long userId);
    List<Attempt> findByExamIdOrderByStartTimeDesc(Long examId);
    List<Attempt> findByUserIdAndExamId(Long userId, Long examId);
    long countByStatus(AttemptStatus status);
    long countByUserId(Long userId);

    @Query("SELECT AVG(a.percentage) FROM Attempt a WHERE a.status <> 'IN_PROGRESS'")
    Double findOverallAveragePercentage();

    @Query("SELECT AVG(a.percentage) FROM Attempt a WHERE a.user.id = :userId AND a.status <> 'IN_PROGRESS'")
    Double findUserAveragePercentage(Long userId);
}
