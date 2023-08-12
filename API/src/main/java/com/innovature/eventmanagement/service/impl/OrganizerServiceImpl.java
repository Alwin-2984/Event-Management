package com.innovature.eventmanagement.service.impl;

import com.innovature.eventmanagement.entity.Organizer;
import com.innovature.eventmanagement.entity.Otp;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.OrganizerLoginForm;
import com.innovature.eventmanagement.form.OrganizerSignupForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.repository.OrganizerRepository;
import com.innovature.eventmanagement.repository.OtpRepository;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.InvalidTokenException;
import com.innovature.eventmanagement.security.util.TokenExpiredException;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.security.util.TokenGenerator.Token;
import com.innovature.eventmanagement.security.util.TokenGenerator.VerificationStatus;
import com.innovature.eventmanagement.service.OrganizerService;
import com.innovature.eventmanagement.util.Constants;
import com.innovature.eventmanagement.util.LanguageUtil;
import com.innovature.eventmanagement.util.OrganizerUtil;
import com.innovature.eventmanagement.util.VerifyUtil;
import com.innovature.eventmanagement.view.EmailTokenView;
import com.innovature.eventmanagement.view.OrganizerLoginView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import java.time.Duration;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import javax.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * Description : Organizer Service Implementation
 * Author Name : Manu Ravi
 */
@Service
public class OrganizerServiceImpl implements OrganizerService {

  private final Logger logger = LoggerFactory.getLogger(OrganizerServiceImpl.class);

  @Autowired
  private VerifyUtil verifyUtil;

  @Autowired
  private OtpRepository otpRepository;

  @Autowired
  private LanguageUtil languageUtil;

  @Value("${global.language}")
  private String globalLanguage;

  @Autowired
  private OrganizerUtil organizerUtil;

  @Autowired
  private SecurityConfig securityConfig;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private OrganizerRepository organizerRepository;

  @Autowired
  private TokenGenerator tokenGenerator;

  @Value("${purpose.token.expiry}")
  private Integer ex;

  // Method for registering a new organizer Registering
  @Override
  public OtpView registration(@Valid OrganizerSignupForm form) {
    Organizer organizer = organizerUtil.checkUserOtpVerified(form.getEmail());

    if (organizer == null) {
      // If the organizer is not found with "OTP_NOT_VERIFIED" status, check if the
      // email already exists for other statuses.
      Organizer existingOrganizer = organizerRepository.findByEmail(form.getEmail());
      if (existingOrganizer != null) {
        // If an organizer with the email already exists, throw a BadRequestException
        // with an appropriate error message.
        throw new BadRequestException(
            languageUtil.getTranslatedText(Constants.EMAIL_ALREADY_EXIST, null, globalLanguage));
      }

      Otp otp = verifyUtil.generateOtp(form.getEmail(), Constants.EMAIL_VERIFICATION_TEMPLATE);
      organizerRepository
          .save(new Organizer(form.getEmail(), passwordEncoder.encode(form.getPassword()), form.getName()));
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), Constants.PURPOSE_EMAIL_TOKEN);
      // Return the OtpView containing token information for verifying OTP.
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      /**
       * If the organizer with "OTP_NOT_VERIFIED" status already exists, generate a
       ** new OTP and sends email & Update the existing organizer's name and password
       * with the new values provided in the form.
       */
      Otp otp = verifyUtil.generateOtp(form.getEmail(), Constants.EMAIL_VERIFICATION_TEMPLATE);
      organizer.setName(form.getName());
      organizer.setPassword(passwordEncoder.encode(form.getPassword()));
      organizerRepository.save(organizer);
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), Constants.PURPOSE_EMAIL_TOKEN);
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    }
  }

  /**
   * Verifies the organizer's OTP with the email token and OTP from form data. If
   * the verification is successful, returns an HTTP OK response; otherwise,
   * throws a BadRequestException.
   *
   * @param form The OTP form containing the email token and the organizer entered
   *             OTP.
   * @return ResponseEntity with HTTP OK status if the OTP verification is
   *         successful.
   * @throws BadRequestException if the OTP verification fails or if the email
   *                             token is invalid.
   */
  public ResponseEntity<String> verify(@Valid OtpForm form) {
    VerificationStatus status = verifyUtil.verifyPurposeToken(Constants.PURPOSE_EMAIL_TOKEN, form.getEmailToken());
    String email = status.data;
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);
    // Matches user entered otp with otp in database
    if (otp != null && Boolean.TRUE.equals(verifyOtp(otp, form.getOtp()))) {
      return new ResponseEntity<>(HttpStatus.OK);
    }
    throw new BadRequestException(languageUtil.getTranslatedText(Constants.UNABLE_TO_PERFORM, null, globalLanguage));
  }

  /**
   * Verify the provided OTP against the given OTP entity and update organizer
   * status accordingly.
   *
   * @param otpEntity The OTP entity to be verified.
   * @param otp       The OTP entered by the organizer for verification.
   * @return True if the OTP is valid and not expired, false otherwise.
   * @throws BadRequestException if the OTP is incorrect or has expired.
   */
  public Boolean verifyOtp(Otp otpEntity, String otp) {
    LocalTime myObj = LocalTime.now();
    // Calculate the difference in seconds between the current time and the OTP
    // expiry
    var expDiff = myObj.until(otpEntity.getExpiry(), ChronoUnit.SECONDS);
    // Check if the provided OTP matches the OTP in the OTP entity
    if ((otp.equals(otpEntity.getOtp()))) {
      // Check if the OTP has not expired
      if (expDiff > 0) {
        Organizer organizer = organizerUtil.checkUserOtpVerified(otpEntity.getEmail());
        if (organizer == null) {
          throw new BadRequestException(
              languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
        }
        organizer.setStatus(Organizer.Status.ACTIVE.value);
        otpEntity.setStatus(Otp.Status.INACTIVE.value);
        otpRepository.save(otpEntity);
        organizerRepository.save(organizer);
        return true;
      }
      throw new BadRequestException(languageUtil.getTranslatedText("otp.expired", null, globalLanguage));
    }
    throw new BadRequestException(languageUtil.getTranslatedText("incorrect.otp", null, globalLanguage));
  }

  /**
   * Generates a purpose token associated with the provided email and token type.
   *
   * @param email     The email for which the token is generated.
   * @param tokenType The type of token to be generated - purpose.
   * @return An EmailTokenView containing the generated token and its expiration
   *         time.
   * @throws BadRequestException if the email is not found or invalid.
   */
  public EmailTokenView generateVerifyOtpToken(String email, String tokenType) {
    Organizer organizer = organizerUtil.checkUserOtpVerified(email);
    if (organizer == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    }
    String roleId = String.format(Constants.DIGIT_FORMAT, organizer.getRole().ordinal());
    Duration duration = Duration.ofMinutes(ex);
    TokenGenerator.Token emailToken = tokenGenerator.create(tokenType, email, roleId, duration);
    return new EmailTokenView(Constants.SUCCESSFULLY_CREATED, emailToken.value, LocalTime.now().plus(duration));
  }

  /**
   * Method to handle the login process for an Organizer.
   *
   * @param form The login form containing email and password.
   * @return OrganizerLoginView containing login details, access token, and
   *         refresh token.
   * @throws BadRequestException if the login request is invalid or unsuccessful.
   */
  public OrganizerLoginView login(OrganizerLoginForm form) throws BadRequestException {
    Organizer organizer = organizerUtil.checkActiveStatus(form.getEmail());
    if (organizer == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    } else {
      // Checks for password matching
      if (!passwordEncoder.matches(form.getPassword(), organizer.getPassword())) {
        throw new BadRequestException(
            languageUtil.getTranslatedText(Constants.EMAIL_PASSWORD_INCORRECT, null, globalLanguage));
      }
    }
    String id = String.format(Constants.DIGIT_FORMAT, organizer.getId());
    String roleId = String.format(Constants.DIGIT_FORMAT, organizer.getRole().ordinal());
    TokenGenerator.Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());
    TokenGenerator.Token refreshToken = tokenGenerator.create(Constants.PURPOSE_REFRESH_TOKEN,
        id + organizer.getPassword(), roleId, securityConfig.getRefreshTokenExpiry());
    logger.info("Organizer Login Successfully");
    return new OrganizerLoginView(organizer, accessToken, refreshToken);
  }

  /**
   * Refreshes the access token using the provided refresh token.
   *
   * @param form The form containing the refresh token.
   * @return RefreshTokenView containing the new access token and refreshed
   *         refresh token.
   * @throws BadRequestException if the refresh token is invalid or expired.
   */
  public RefreshTokenView refresh(RefreshTokenForm form) throws BadRequestException {
    VerificationStatus status;
    try {
      status = tokenGenerator.verify(Constants.PURPOSE_REFRESH_TOKEN, form.getRefreshToken());
    } catch (InvalidTokenException e) {
      throw new BadRequestException("1091-Token is invalid", e);
    } catch (TokenExpiredException e) {
      throw new BadRequestException("1090-Authorization token expired", e);
    }
    int userid;
    try {
      userid = Integer.parseInt(status.data.substring(0, 10).trim());
    } catch (NumberFormatException e) {
      throw new BadRequestException("1091-Token is invalid", e);
    }
    String password = status.data.substring(10);
    Organizer organizer = organizerRepository
        .findByIdAndPasswordAndStatus(userid, password, Organizer.Status.ACTIVE.value)
        .orElseThrow(() -> new BadRequestException(
            languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage)));
    String role = String.format(Constants.DIGIT_FORMAT, organizer.getRole().ordinal());
    String id = String.format(Constants.DIGIT_FORMAT, organizer.getId());
    Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, role,
        securityConfig.getAccessTokenExpiry());
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }
}
