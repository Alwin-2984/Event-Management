package com.innovature.eventmanagement.controller;

import com.innovature.eventmanagement.form.OrganizerLoginForm;
import com.innovature.eventmanagement.form.OrganizerSignupForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.service.OrganizerService;
import com.innovature.eventmanagement.view.OrganizerLoginView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
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
@RequestMapping("/organizer")
@RequiredArgsConstructor
public class OrganizerController {

  @Autowired
  private OrganizerService organizerService;

  // Organizer signup - returns email token, OTP will be sent through email
  @PostMapping
  public OtpView registration(@Valid @RequestBody OrganizerSignupForm form) {
    return organizerService.registration(form);
  }

  // OTP verification - Organizer should verify OTP inorder to get ACTIVE status
  @PostMapping("/verify")
  public ResponseEntity<String> verify(@Valid @RequestBody OtpForm form) {
    organizerService.verify(form);
    return new ResponseEntity<>(HttpStatus.OK);
  }

  // Organizer login
  @PostMapping("/login")
  public OrganizerLoginView login(@Valid @RequestBody OrganizerLoginForm form) {
    return organizerService.login(form);
  }

  // Organizer refresh token - Generates access token from refresh token
  @PutMapping("/login")
  public RefreshTokenView refresh(@Valid @RequestBody RefreshTokenForm form) {
    return organizerService.refresh(form);
  }
}
