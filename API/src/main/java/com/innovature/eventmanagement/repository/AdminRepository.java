package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.Admin;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {

    Optional<Admin> findByEmail(String email);

    Admin findById(int userId);

    Optional<Admin> findByIdAndPassword(int id, String password);    

}