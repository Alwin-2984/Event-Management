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

@Service
public class OrganizerServiceImpl implements OrganizerService {

  private final Logger logger = LoggerFactory.getLogger(OrganizerServiceImpl.class);
  private static final String EMAIL_NOT_FOUND = "email.not.found";
  private static final String EMAIL_PASSWORD_INCORRECT = "email.password.incorrect";
  public static final String PURPOSE_ACCESS_TOKEN = "ACCESS_TOKEN";
  private static final String PURPOSE_REFRESH_TOKEN = "REFRESH_TOKEN";
  private static final String PURPOSE_EMAIL_TOKEN = "EMAIL_TOKEN";
  private static final String EMAIL_ALREADY_EXIST = "email.already.exist";
  private static final String UNABLE_TO_PERFORM = "unable.to.perform.this.action";
  private static final String DIGIT_FORMAT = "%10d";
  public static final String SUCCESSFULLY_CREATED = "successfully created";
  public static final String EMAIL_VERIFICATION_TEMPLATE = "signupEmailContent";

  @Autowired
  private VerifyUtil verifyUtil;

  @Autowired
  private OtpRepository otpRepository;

  @Autowired
  private LanguageUtil languageUtil;

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

  /**
   * Method for registering a new organizer Registering with email, name, and
   * password, and initiating OTP verification.
   */
  @Override
  public OtpView registration(@Valid OrganizerSignupForm form) {
    // Check if the organizer with the provided email has already been verified with
    // OTP.
    Organizer organizer = organizerUtil.checkUserOtpVerified(form.getEmail());

    if (organizer == null) {
      // If the organizer is not found with "OTP_NOT_VERIFIED" status, check if the
      // email already exists for other statuses.
      Organizer existingOrganizer = organizerRepository.findByEmail(form.getEmail());
      if (existingOrganizer != null) {
        // If an organizer with the email already exists, throw a BadRequestException
        // with an appropriate error message.
        throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_ALREADY_EXIST, null, "en"));
      }

      // Since the organizer with the email doesn't exist, proceed with OTP generation
      // and registration and send email.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), EMAIL_VERIFICATION_TEMPLATE);
      // Save the new organizer's registration details (email, password, name) in the
      // database.
      organizerRepository
          .save(new Organizer(form.getEmail(), passwordEncoder.encode(form.getPassword()), form.getName()));

      // Generate a purpose-specific token associated with the email for future
      // verification purposes.
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), PURPOSE_EMAIL_TOKEN);

      // Return the OtpView containing token information for verifying OTP.
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      // If the organizer with "OTP_NOT_VERIFIED" status already exists, generate a
      // new OTP and sends email.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), EMAIL_VERIFICATION_TEMPLATE);
      // Update the existing organizer's name and password with the new values
      // provided in the form.
      organizer.setName(form.getName());
      organizer.setPassword(passwordEncoder.encode(form.getPassword()));
      organizerRepository.save(organizer);

      // Generate a purpose-specific token associated with the email for future
      // verification purposes.
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), PURPOSE_EMAIL_TOKEN);

      // Return the OtpView containing token information for verifying OTP.
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
    // Verify the purpose token (email token) using the provided email token .
    VerificationStatus status = verifyUtil.verifyPurposeToken(PURPOSE_EMAIL_TOKEN, form.getEmailToken());

    // Extract the email from the verified token data.
    String email = status.data;

    // Find the active OTP record for the given email in the OTP repository.
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);

    // Check if an active OTP record was found and if the organizer-entered OTP
    // matches the stored OTP.
    if (otp != null && Boolean.TRUE.equals(verifyOtp(otp, form.getOtp()))) {
      // If OTP verification is successful, return an HTTP OK response.
      return new ResponseEntity<>(HttpStatus.OK);
    }

    // If OTP verification fails due to reverifying with otp, throws a
    // BadRequestException with an error message.
    throw new BadRequestException(languageUtil.getTranslatedText(UNABLE_TO_PERFORM, null, "en"));
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
    // Get the current time
    LocalTime myObj = LocalTime.now();

    // Calculate the difference in seconds between the current time and the OTP
    // expiry time
    var expDiff = myObj.until(otpEntity.getExpiry(), ChronoUnit.SECONDS);

    // Check if the provided OTP matches the OTP in the OTP entity
    if ((otp.equals(otpEntity.getOtp()))) {
      // Check if the OTP has not expired
      if (expDiff > 0) {
        // OTP is valid and not expired, proceed with verification

        // Check if the organizer associated with the OTP email have verified the otp
        Organizer organizer = organizerUtil.checkUserOtpVerified(otpEntity.getEmail());
        if (organizer == null) {
          // Organizer not found, throw a BadRequestException with an email not found
          // message
          throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
        }

        // Set the organizer's status to ACTIVE
        organizer.setStatus(Organizer.Status.ACTIVE.value);

        // Set the OTP entity's status to INACTIVE once verified
        otpEntity.setStatus(Otp.Status.INACTIVE.value);

        // Save the updated OTP entity and organizer in the respective repositories
        otpRepository.save(otpEntity);
        organizerRepository.save(organizer);

        // OTP verification successful, return true
        return true;
      }

      // The OTP has expired, throw a BadRequestException with an error message
      throw new BadRequestException(languageUtil.getTranslatedText("otp.expired", null, "en"));
    }

    // Incorrect OTP provided, throw a BadRequestException with an error message
    throw new BadRequestException(languageUtil.getTranslatedText("incorrect.otp", null, "en"));
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
    // Check if the organizer associated with the email has verified OTP
    Organizer organizer = organizerUtil.checkUserOtpVerified(email);

    // If the organizer is null, the email was not found or not verified, throw a
    // BadRequestException
    if (organizer == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    }

    // Convert the organizer's role to a formatted string
    String roleId = String.format(DIGIT_FORMAT, organizer.getRole().ordinal());

    // Set the token expiration duration in minutes,'ex' variable is expiry of
    // token)
    Duration duration = Duration.ofMinutes(ex);

    // Generate a new token for the provided purpose type, with the email and role
    // ID & expiry time
    TokenGenerator.Token emailToken = tokenGenerator.create(tokenType, email, roleId, duration);

    // Return an EmailTokenView containing the success status, the generated token
    // value, and its expiration time
    return new EmailTokenView(SUCCESSFULLY_CREATED, emailToken.value, LocalTime.now().plus(duration));
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
    // Check if the organizer with the given email is active in the system.
    Organizer organizer = organizerUtil.checkActiveStatus(form.getEmail());

    // If the organizer is not found, throw a BadRequestException with an
    // appropriate error message.
    if (organizer == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    } else {
      // If the organizer is found, compare the provided password with the stored
      // password using passwordEncoder.
      if (!passwordEncoder.matches(form.getPassword(), organizer.getPassword())) {
        // If the password does not match, throw a BadRequestException with an email or
        // passoword incorrect message.
        throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_PASSWORD_INCORRECT, null, "en"));
      }
    }

    // Format the organizer's ID and role ID as strings.
    String id = String.format(DIGIT_FORMAT, organizer.getId());
    String roleId = String.format(DIGIT_FORMAT, organizer.getRole().ordinal());

    // Generate a new access token for the organizer with their ID and role ID.
    TokenGenerator.Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());

    // Generate a new refresh token for the organizer with their ID and password
    // concatenated, along with the role ID.
    TokenGenerator.Token refreshToken = tokenGenerator.create(PURPOSE_REFRESH_TOKEN, id + organizer.getPassword(),
        roleId, securityConfig.getRefreshTokenExpiry());

    // Log a message indicating a successful organizer login.
    logger.info("Organizer Login Successfully");

    // Create and return an OrganizerLoginView containing the organizer's details,
    // access token, and refresh token.
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
      // Verify the validity and expiration of the provided refresh token.
      status = tokenGenerator.verify(PURPOSE_REFRESH_TOKEN, form.getRefreshToken());
    } catch (InvalidTokenException e) {
      // If the refresh token is invalid, throw a BadRequestException with an error
      // message.
      throw new BadRequestException("1091-Token is invalid", e);
    } catch (TokenExpiredException e) {
      // If the refresh token is expired, throw a BadRequestException with an error
      // message.
      throw new BadRequestException("1090-Authorization token expired", e);
    }

    int userid;
    try {
      // Extract the organizer ID from the verified refresh token data.
      userid = Integer.parseInt(status.data.substring(0, 10).trim());
    } catch (NumberFormatException e) {
      // If the organizer ID cannot be parsed from the token data, throw a
      // BadRequestException with an error message.
      throw new BadRequestException("1091-Token is invalid", e);
    }

    // Extract the password from the verified refresh token data.
    String password = status.data.substring(10);

    // Find the organizer in the repository using the extracted organizer ID and
    // password.
    Organizer organizer = organizerRepository
        .findByIdAndPasswordAndStatus(userid, password, Organizer.Status.ACTIVE.value)
        .orElseThrow(() -> new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en")));

    // Format the organizer's role and ID as strings.
    String role = String.format(DIGIT_FORMAT, organizer.getRole().ordinal());
    String id = String.format(DIGIT_FORMAT, organizer.getId());

    // Generate a new access token for the organizer.
    Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, role, securityConfig.getAccessTokenExpiry());

    // Create and return a new RefreshTokenView containing the new access token and
    // refreshed refresh token.
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }
}
