package com.innovature.eventmanagement.form;

import com.innovature.eventmanagement.form.validation.DateNotFuture;
import com.innovature.eventmanagement.form.validation.Email;
import com.innovature.eventmanagement.form.validation.GenderMatch;
import com.innovature.eventmanagement.form.validation.Name;
import com.innovature.eventmanagement.form.validation.Password;
import java.sql.Date;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserSignupForm {

  @Email
  private String email;

  @Password
  private String password;

  @Name
  private String name;

  @GenderMatch
  private Byte gender;

  @DateNotFuture
  private Date dob;

}
