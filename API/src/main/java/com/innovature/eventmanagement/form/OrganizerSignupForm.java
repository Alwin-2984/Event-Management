package com.innovature.eventmanagement.form;

import com.innovature.eventmanagement.form.validation.Email;
import com.innovature.eventmanagement.form.validation.Name;
import com.innovature.eventmanagement.form.validation.Password;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrganizerSignupForm {

  @Email
  private String email;

  @Password
  private String password;

  @Name
  private String name;
  
}
