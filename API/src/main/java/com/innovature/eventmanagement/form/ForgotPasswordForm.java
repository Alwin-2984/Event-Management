package com.innovature.eventmanagement.form;

import javax.validation.constraints.NotBlank;

import com.innovature.eventmanagement.form.validation.Password;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordForm {

  @Password
  private String password;

  @NotBlank(message = "{emailToken.should.required}")
  private String emailToken;

}
