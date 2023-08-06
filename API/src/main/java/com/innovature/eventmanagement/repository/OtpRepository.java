package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.Otp;
import org.springframework.data.repository.Repository;

public interface OtpRepository extends Repository<Otp, Integer> {
  
  Otp save(Otp otp);

  Otp findByEmail(String email);

  Otp findByEmailAndStatus(String email, byte status);
  
}
