package com.innovature.eventmanagement.form;

import com.innovature.eventmanagement.form.validation.Email;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ForgotPasswordEmailForm {

  @Email
  private String email;

}
