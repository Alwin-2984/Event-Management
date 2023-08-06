package com.innovature.eventmanagement.form;

import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AdminLoginForm {

  @NotBlank(message = "{email.required}")
  private String email;

  @NotBlank(message = "{password.required}")
  private String password;
  
}
