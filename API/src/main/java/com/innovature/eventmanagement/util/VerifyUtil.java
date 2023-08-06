package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.entity.Otp;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.repository.OtpRepository;
import com.innovature.eventmanagement.security.util.InvalidTokenException;
import com.innovature.eventmanagement.security.util.TokenExpiredException;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.security.util.TokenGenerator.VerificationStatus;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class VerifyUtil {

  public static final String SUCCESSFULLY_CREATED = "successfully created";
  private static final String INVALID_TOKEN_EMAIL = "Invalid.Token.Email";

  @Autowired
  private OtpRepository otpRepository;

  @Autowired
  private LanguageUtil languageUtil;

  @Autowired
  private EmailContents emailContents;

  @Autowired
  private EmailUtil emailUtil;
  @Autowired
  private TokenGenerator tokenGenerator;

  @Value("${purpose.token.expiry}")
  private Integer ex;

  @Value("${otp.expiry}")
  private Integer otpValidity;

  Random random1 = new Random();

  public Otp generateOtp(String email, String emailTemplate) {
    int otp = 100000 + random1.nextInt(900000);
    String otpStr = String.valueOf(otp);
    LocalTime exp = LocalTime.now();
    Otp otp1 = otpRepository.findByEmail(email);
    // Extract the email address of the recipient
    String to = email;

    // Generate the content of the email by using the OTP and a predefined email
    // template

    String content;
    if (emailTemplate.equals("signupEmailContent")) {
      content = emailContents.signupEmailContent(otpStr);
    } else {
      content = emailContents.forgotPasswordEmailContent(otpStr);
    }
    // Set the subject of the verification email
    String subject = "Email Verification";

    // Data in otp table will be updated if email is present in otp table
    if (otp1 != null) {
      otp1.setOtp(otpStr);
      otp1.setExpiry(exp);
      otp1.setExpiry(exp.plus(otpValidity, ChronoUnit.MINUTES));
      otp1.setStatus(Otp.Status.ACTIVE.value);
      otpRepository.save(otp1);

      emailUtil.sendEmail(to, content, subject);
      return otp1;
    } else {
      Otp otpEntity = new Otp();
      otpEntity.setEmail(email);
      otpEntity.setOtp(otpStr);
      otpEntity.setExpiry(exp.plus(otpValidity, ChronoUnit.MINUTES));
      otpEntity.setCreatedAt(new Date());
      otpEntity.setStatus(Otp.Status.ACTIVE.value);
      otpRepository.save(otpEntity);

      emailUtil.sendEmail(to, content, subject);
      return otpEntity;
    }
  }

  public VerificationStatus verifyPurposeToken(String tokenType, String token) {
    try {
      return tokenGenerator.verify(tokenType, token);
    } catch (InvalidTokenException e) {
      throw new BadRequestException(languageUtil.getTranslatedText(INVALID_TOKEN_EMAIL, null, "en"), e);
    } catch (TokenExpiredException e) {
      throw new BadRequestException(languageUtil.getTranslatedText("token.expired", null, "en"), e);
    }
  }
}
