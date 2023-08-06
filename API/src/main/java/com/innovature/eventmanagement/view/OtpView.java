package com.innovature.eventmanagement.view;

import java.time.LocalTime;
import lombok.Getter;

@Getter
public class OtpView {

  private final String message;
  private final String emailToken;
  private final LocalTime tokenExpiry;

  private LocalTime otpExpiry;

  public OtpView(
    String msg,
    String emailToken,
    LocalTime tokenExpiry,
    LocalTime otpExpiry
  ) {
    this.message = msg;
    this.emailToken = emailToken;
    this.tokenExpiry = tokenExpiry;

    this.otpExpiry = otpExpiry;
  }
}
