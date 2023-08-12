package com.innovature.eventmanagement.service;

import javax.validation.Valid;

import org.springframework.http.ResponseEntity;

import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.AdminLoginForm;
import com.innovature.eventmanagement.form.CategoryForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.util.Pager;
import com.innovature.eventmanagement.view.AdminLoginView;
import com.innovature.eventmanagement.view.CategoryListView;
import com.innovature.eventmanagement.view.CategoryView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserListView;
import com.innovature.eventmanagement.view.CountView;
import com.innovature.eventmanagement.view.OrganizerListView;

public interface AdminService {

  AdminLoginView login(AdminLoginForm form) throws BadRequestException;

  RefreshTokenView refresh(RefreshTokenForm form);

  Pager<UserListView> listUsers(String search, Integer page, Integer size, String sort, Integer order, Integer status);

  Pager<OrganizerListView> listOrganizers(String search, Integer page, Integer size, String sort, Integer order,
      Integer status);

  CountView getActiveUserCount();

  ResponseEntity<String> manageUser(Long id, String status);

  ResponseEntity<String> addCategory(@Valid CategoryForm form);

  Pager<CategoryListView> getCategoryList(String search, Integer page, Integer size, String sort, Integer order);

  CategoryView getCategoryDetail(Long id);

  ResponseEntity<String> categoryUpdate(Long id, @Valid CategoryForm form);

  ResponseEntity<String> categoryDelete(Long id);

  ResponseEntity<String> DeleteOrganizer(Long id, String status);

  CountView ActiveOrganizerCount();

}
