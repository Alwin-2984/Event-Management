package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, Long> {

  User findByEmail(String email);

  User findByEmailAndStatus(String email, byte value);

  Optional<User> findByIdAndPassword(long userid, String password);

  Optional<User> findByIdAndPasswordAndStatus(long userid, String password, byte status);

  public boolean existsByEmail(String email);
 @Query("SELECT COUNT(u) FROM User u WHERE " +
       "((:status = 0 AND u.status in (0,1)) OR " +
       "(:status = 1 AND u.status = 0) OR " +
       "(:status = 2 AND u.status = 1)) " +
       "AND (LOWER(u.name) LIKE %:name% OR LOWER(u.email) LIKE %:email%)")
  int countByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Integer status, String name, String email);
  @Query("SELECT u FROM User u WHERE " +
       "((:status = 0 AND u.status in (0,1)) OR " +
       "(:status = 1 AND u.status = 0) OR " +
       "(:status = 2 AND u.status = 1)) " +
       "AND (LOWER(u.name) LIKE %:name% OR LOWER(u.email) LIKE %:email%)")
  Page<User> findByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(Integer status, String name,
      String email, PageRequest of);

  Integer countByStatus(byte value);

  Page<User> findByStatusIn(List<Byte> statusValue, PageRequest of);

  Integer countByStatusIn(List<Byte> statusValue);

}
