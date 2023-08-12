package com.innovature.eventmanagement.service;

import com.innovature.eventmanagement.entity.Admin;
import com.innovature.eventmanagement.enums.Role;
import com.innovature.eventmanagement.repository.AdminRepository;
import javax.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/*
 * Description : This service will add an admin account with credentials into
 * database if there is no admin account present at the moment
 * Author Name : Manu Ravi
 */
@Service
public class AdminInitializationService {

  @Autowired
  private AdminRepository adminRepository;

  @PostConstruct
  public void init() {
    // Check if the admin table is empty
    if (adminRepository.count() == 0) {
      Admin admin = new Admin();
      admin.setId(null);
      admin.setEmail("admin@gmail.com");
      admin.setPassword("{bcrypt}$2a$10$xdNeBT1fC9baqG4fmEPh3ORD0xTBNgzypcjTHKwP5joeQxOvg93da");
      admin.setRole(Role.ADMIN);
      adminRepository.save(admin);
    }
  }
}
