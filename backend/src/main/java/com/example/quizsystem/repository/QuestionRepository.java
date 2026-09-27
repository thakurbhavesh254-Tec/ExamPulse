package com.example.quizsystem.repository;

import com.example.quizsystem.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByExamId(Long examId);
    List<Question> findByExamIdIn(List<Long> examIds);
    long countByExamId(Long examId);
}
