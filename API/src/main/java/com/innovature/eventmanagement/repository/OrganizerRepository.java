package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.Organizer;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {

    Organizer findByEmail(String email);

    Organizer findByEmailAndStatus(String email, byte value);

    Optional<Organizer> findByIdAndPassword(long userid, String password);

    Optional<Organizer> findByIdAndPasswordAndStatus(long userid, String password, byte status);

    @Query("SELECT u FROM Organizer u WHERE " +
            "((:status = 0 AND u.status in (0,1)) OR " +
            "(:status = 1 AND u.status = 0) OR " +
            "(:status = 2 AND u.status = 1)) " +
            "AND (LOWER(u.name) LIKE %:name% OR LOWER(u.email) LIKE %:email%)")
    Page<Organizer> findByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Integer status, String name,
            String email, PageRequest of);

    @Query("SELECT COUNT(u) FROM Organizer u WHERE " +
            "((:status = 0 AND u.status in (0,1)) OR " +
            "(:status = 1 AND u.status = 0) OR " +
            "(:status = 2 AND u.status = 1)) " +
            "AND (LOWER(u.name) LIKE %:name% OR LOWER(u.email) LIKE %:email%)")
    int countByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Integer status, String name,
            String email);

    Integer countByStatus(byte value);
}
