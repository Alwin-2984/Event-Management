package com.innovature.eventmanagement.controller;

import com.innovature.eventmanagement.form.AdminLoginForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.service.AdminService;
import com.innovature.eventmanagement.util.Pager;
import com.innovature.eventmanagement.view.AdminLoginView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserListView;
import com.innovature.eventmanagement.view.countView;

import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

  @Autowired
  private AdminService adminService;

  // Admin Login - returns access and refresh token
  @PostMapping("/login")
  public AdminLoginView login(@Valid @RequestBody AdminLoginForm form) {
    return adminService.login(form);
  }

  // Admin refresh token - Generates access token from refresh token
  @PutMapping("/login")
  public RefreshTokenView refresh(@Valid @RequestBody RefreshTokenForm form) {
    return adminService.refresh(form);
  }

  // Fetch user list according to the status
  @GetMapping("/users")
  public Pager<UserListView> getUserList(
      @RequestParam(name = "search", defaultValue = "", required = false) String search,
      @RequestParam(name = "page", defaultValue = "1", required = false) Integer page,
      @RequestParam(name = "size", defaultValue = "10", required = false) Integer size,
      @RequestParam(name = "sort", defaultValue = "updatedAt", required = false) String sort,
      @RequestParam(name = "order", defaultValue = "1", required = false) Integer order,
      @RequestParam(name = "status", defaultValue = "0",required =true ) Integer status) {
    return adminService.listUsers(search, page, size, sort, order, status);
  }

  @GetMapping("/activeUserCount")
  public countView getActiveUserCount(){
    return adminService.getActiveUserCount();
  }

  @PutMapping("/users/{id}/{status}")
    public ResponseEntity<String> manageUser(@PathVariable String id, @PathVariable String status) {
        return adminService.manageUser(id,status);
    }
}
