package com.innovature.eventmanagement.service;

import com.innovature.eventmanagement.form.ForgotPasswordEmailForm;
import com.innovature.eventmanagement.form.ForgotPasswordForm;
import com.innovature.eventmanagement.form.GoogleSignInForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.form.UserLoginForm;
import com.innovature.eventmanagement.form.UserSignupForm;
import com.innovature.eventmanagement.view.EmailTokenView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserLoginView;
import com.innovature.eventmanagement.view.UserView;
import java.io.IOException;
import java.security.GeneralSecurityException;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
public interface UserService {

  OtpView registration(@Valid UserSignupForm form);

  UserView googleAuth(GoogleSignInForm form, Byte userRole)throws GeneralSecurityException, IOException;

  ResponseEntity<String> verify(@Valid OtpForm form);

  EmailTokenView verifyForgotPasswordToken(@Valid OtpForm form);

  UserLoginView login(@Valid UserLoginForm form);

  RefreshTokenView refresh(@Valid RefreshTokenForm form);

  OtpView forgotPassword(@Valid ForgotPasswordEmailForm form);

  ResponseEntity<String> setPassword(@Valid ForgotPasswordForm form); 
  
}
