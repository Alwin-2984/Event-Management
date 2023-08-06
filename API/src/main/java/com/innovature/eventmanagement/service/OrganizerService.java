package com.innovature.eventmanagement.service;

import com.innovature.eventmanagement.form.OrganizerLoginForm;
import com.innovature.eventmanagement.form.OrganizerSignupForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.view.OrganizerLoginView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
public interface OrganizerService {

  OtpView registration(@Valid OrganizerSignupForm form);

  ResponseEntity<String> verify(@Valid OtpForm form);

  OrganizerLoginView login(@Valid OrganizerLoginForm form);

  RefreshTokenView refresh(@Valid RefreshTokenForm form);

}
