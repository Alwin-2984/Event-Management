package com.innovature.eventmanagement.controller;

import com.innovature.eventmanagement.enums.Role;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.ForgotPasswordEmailForm;
import com.innovature.eventmanagement.form.ForgotPasswordForm;
import com.innovature.eventmanagement.form.GoogleSignInForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.form.UserLoginForm;
import com.innovature.eventmanagement.form.UserSignupForm;
import com.innovature.eventmanagement.service.UserService;
import com.innovature.eventmanagement.view.EmailTokenView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserLoginView;
import com.innovature.eventmanagement.view.UserView;
import java.io.IOException;
import java.security.GeneralSecurityException;
import javax.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

  @Autowired
  private UserService userService;

  // User signup - returns email token, OTP will be sent through email
  @PostMapping
  public OtpView registration(@Valid @RequestBody UserSignupForm form) {
    return userService.registration(form);
  }

  // OTP verification - User should verify OTP inorder to get ACTIVE status
  @PostMapping("/verify")
  public ResponseEntity<String> verify(@Valid @RequestBody OtpForm form) {
    userService.verify(form);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // User google signin - Validated using the token provided by google
  @PostMapping("/googleAuth")
  public UserView googleAuth(@Valid @RequestBody GoogleSignInForm form)
      throws BadRequestException, GeneralSecurityException, IOException {
    return userService.googleAuth(form, Role.USER.value);
  }

  // User login
  @PostMapping("/login")
  public UserLoginView login(@Valid @RequestBody UserLoginForm form) {
    return userService.login(form);
  }

  // User refresh token - Generates access token from refresh token
  @PutMapping("/login")
  public RefreshTokenView refresh(@Valid @RequestBody RefreshTokenForm form) {
    return userService.refresh(form);
  }

  // Forgot password - API for generating OTP
  @PostMapping("/forgotPassword")
  public OtpView forgotPassword(@Valid @RequestBody ForgotPasswordEmailForm form) {
    return userService.forgotPassword(form);
  }

  // OTP verification for forgot password
  @PostMapping("/verifyForgotPassword")
  public EmailTokenView verifyForgotPasswordToken(@Valid @RequestBody OtpForm form) {
    return userService.verifyForgotPasswordToken(form);
  }

  // Set Password by verifying with email token
  // A token and the new password will be passed in the form
  @PostMapping("/setPassword")
  public ResponseEntity<String> forgotPassword(@Valid @RequestBody ForgotPasswordForm form) {
    return userService.setPassword(form);
  }

}
