package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.Organizer;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
  
  Organizer findByEmail(String email);

  Organizer findByEmailAndStatus(String email, byte value);

  Optional<Organizer> findByIdAndPassword(long userid, String password);

  Optional<Organizer> findByIdAndPasswordAndStatus(long userid, String password, byte status);

}
