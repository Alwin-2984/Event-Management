package com.innovature.eventmanagement.service;

import org.springframework.http.ResponseEntity;

import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.AdminLoginForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.util.Pager;
import com.innovature.eventmanagement.view.AdminLoginView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserListView;
import com.innovature.eventmanagement.view.countView;
public interface AdminService {

  AdminLoginView login(AdminLoginForm form) throws BadRequestException;

  RefreshTokenView refresh(RefreshTokenForm form);

  Pager<UserListView> listUsers(String search, Integer page, Integer size, String sort, Integer order, Integer status);

  countView getActiveUserCount();

  ResponseEntity<String> manageUser(String id, String status);

}
