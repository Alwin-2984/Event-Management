package com.innovature.eventmanagement.form;

import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class OtpForm {

  @NotBlank(message = "{otp.should.required}")
  private String otp;

  @NotBlank(message = "{emailToken.should.required}")
  private String emailToken;
  
}
