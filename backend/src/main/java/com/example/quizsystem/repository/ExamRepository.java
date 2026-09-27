package com.example.quizsystem.repository;

import com.example.quizsystem.entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByPublishedTrue();
    List<Exam> findBySubjectId(Long subjectId);
    List<Exam> findBySubjectIdAndPublishedTrue(Long subjectId);
    Optional<Exam> findByCode(String code);
    Boolean existsByCode(String code);
    long countByPublishedTrue();
}
