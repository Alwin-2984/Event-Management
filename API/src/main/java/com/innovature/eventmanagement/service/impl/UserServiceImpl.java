package com.innovature.eventmanagement.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.innovature.eventmanagement.entity.Otp;
import com.innovature.eventmanagement.entity.User;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.ForgotPasswordEmailForm;
import com.innovature.eventmanagement.form.ForgotPasswordForm;
import com.innovature.eventmanagement.form.GoogleSignInForm;
import com.innovature.eventmanagement.form.OtpForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.form.UserLoginForm;
import com.innovature.eventmanagement.form.UserSignupForm;
import com.innovature.eventmanagement.repository.OtpRepository;
import com.innovature.eventmanagement.repository.UserRepository;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.InvalidTokenException;
import com.innovature.eventmanagement.security.util.TokenExpiredException;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.security.util.TokenGenerator.Token;
import com.innovature.eventmanagement.security.util.TokenGenerator.VerificationStatus;
import com.innovature.eventmanagement.service.UserService;
import com.innovature.eventmanagement.util.Constants;
import com.innovature.eventmanagement.util.LanguageUtil;
import com.innovature.eventmanagement.util.UserUtil;
import com.innovature.eventmanagement.util.VerifyUtil;
import com.innovature.eventmanagement.view.EmailTokenView;
import com.innovature.eventmanagement.view.OtpView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserLoginView;
import com.innovature.eventmanagement.view.UserView;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.time.Duration;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.Collections;
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
 * Description : User Service Implementation
 * Author Name : Manu Ravi
 */
@Service
public class UserServiceImpl implements UserService {

  @Value("${google.id}")
  private String googleId;

  private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

  @Autowired
  private VerifyUtil verifyUtil;

  @Autowired
  private OtpRepository otpRepository;

  @Autowired
  private LanguageUtil languageUtil;

  @Value("${global.language}")
  private String globalLanguage;

  @Autowired
  private UserUtil userUtil;

  @Autowired
  private SecurityConfig securityConfig;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private TokenGenerator tokenGenerator;

  @Value("${purpose.token.expiry}")
  private Integer ex;

  /**
   * Method for registering a new user with email, name, and password, and
   * initiating OTP verification. Gender and Date of birth are optional fields
   */
  @Override
  public OtpView registration(@Valid UserSignupForm form) {
    User user = userUtil.checkUserOtpVerified(form.getEmail());
    if (user == null) {
      /**
       * The user is not found with OTP_NOT_VERIFIED status, so check if the user
       * exists with other status - if found displays email already exist message.
       **/
      User existingUser = userRepository.findByEmail(form.getEmail());
      if (existingUser != null) {
        throw new BadRequestException(
            languageUtil.getTranslatedText(Constants.EMAIL_ALREADY_EXIST, null, globalLanguage));
      }
      Otp otp = verifyUtil.generateOtp(form.getEmail(), Constants.EMAIL_VERIFICATION_TEMPLATE);
      userRepository.save(new User(form.getEmail(), passwordEncoder.encode(form.getPassword()), form.getName(),
          form.getGender(), form.getDob()));
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), Constants.PURPOSE_EMAIL_TOKEN);
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      // else, User with "OTP_NOT_VERIFIED" status already exists, so generate a new
      // OTP and
      // sends mail.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), Constants.EMAIL_VERIFICATION_TEMPLATE);
      user.setName(form.getName());
      user.setDob(form.getDob());
      user.setGender(form.getGender());
      user.setPassword(passwordEncoder.encode(form.getPassword()));
      userRepository.save(user);
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), Constants.PURPOSE_EMAIL_TOKEN);
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    }
  }

  /**
   * Method to verify the OTP and emailtoken provided in the OtpForm . It returns
   * a ResponseEntity with HTTP status OK if the OTP is successfully verified.
   */
  public ResponseEntity<String> verify(@Valid OtpForm form) {
    VerificationStatus status = verifyUtil.verifyPurposeToken(Constants.PURPOSE_EMAIL_TOKEN, form.getEmailToken());
    String email = status.data;
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);
    // Check if the OTP object exists and if the OTP provided in the form matches.
    if (otp != null && Boolean.TRUE.equals(verifyOtp(otp, form.getOtp()))) {
      return new ResponseEntity<>(HttpStatus.OK);
    }
    throw new BadRequestException(languageUtil.getTranslatedText(Constants.UNABLE_TO_PERFORM, null, globalLanguage));
  }

  /**
   * Method to verify the OTP for forgot password from emailtoken provided in the
   * OtpForm . It returns a ResponseEntity with HTTP status OK if the OTP is
   * successfully verified.
   */
  public EmailTokenView verifyForgotPasswordToken(@Valid OtpForm form) {
    VerificationStatus status = verifyUtil.verifyPurposeToken(Constants.FORGOT_PASSWORD_TOKEN, form.getEmailToken());
    String email = status.data;
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);
    // Check if the OTP object exists and if the OTP provided in the form matches.
    if (otp != null && Boolean.TRUE.equals(forgotPasswordVerifyOtp(otp, form.getOtp()))) {
      EmailTokenView emailTokenView = generateForgotPasswordToken(email, Constants.PURPOSE_SET_PASSWORD);
      return new EmailTokenView("OTP Verified successfully", emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry());
    }
    throw new BadRequestException(languageUtil.getTranslatedText(Constants.UNABLE_TO_PERFORM, null, globalLanguage));
  }

  /**
   * Verifies the provided OTP against the given OTP entity and activates the user
   * if the OTP is valid and not expired.
   *
   * @param otpEntity The OTP entity to verify against.
   * @param otp       The OTP to be verified.
   * @return True if the OTP is valid and not expired, and the user is activated,
   *         otherwise, false.
   * @throws BadRequestException if the OTP is expired or incorrect.
   */
  public Boolean verifyOtp(Otp otpEntity, String otp) {
    LocalTime myObj = LocalTime.now();
    // Calculate the difference between the current time and the OTP's expiry time
    // in seconds
    var expDiff = myObj.until(otpEntity.getExpiry(), ChronoUnit.SECONDS);

    // Check if the provided OTP matches the stored OTP
    if ((otp.equals(otpEntity.getOtp()))) {
      // Check if the OTP is still valid (not expired)
      if (expDiff > 0) {
        User user = userUtil.checkUserOtpVerified(otpEntity.getEmail());
        if (user == null) {
          throw new BadRequestException(
              languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
        }
        user.setStatus(User.Status.ACTIVE.value);
        otpEntity.setStatus(Otp.Status.INACTIVE.value);
        otpRepository.save(otpEntity);
        userRepository.save(user);
        return true;
      }
      throw new BadRequestException(languageUtil.getTranslatedText("otp.expired", null, globalLanguage));
    }
    throw new BadRequestException(languageUtil.getTranslatedText("incorrect.otp", null, globalLanguage));
  }

  /**
   * Verifies the provided forgot passowrd OTP against the given OTP entity and
   * verifies the user if the OTP is valid and not expired.
   *
   * @param otpEntity The OTP entity to verify against.
   * @param otp       The OTP to be verified.
   * @return True if the OTP is valid and not expired, and the user is in active
   *         state, otherwise, false.
   * @throws BadRequestException if the OTP is expired or incorrect.
   */
  public Boolean forgotPasswordVerifyOtp(Otp otpEntity, String otp) {
    LocalTime myObj = LocalTime.now();
    // Calculate the difference between the current time and the OTP's expiry time
    // in seconds
    var expDiff = myObj.until(otpEntity.getExpiry(), ChronoUnit.SECONDS);
    // Check if the provided OTP matches the stored OTP
    if ((otp.equals(otpEntity.getOtp()))) {
      // Check if the OTP is still valid (not expired)
      if (expDiff > 0) {
        // Retrieve the user with the provided email from the OTP entity
        User user = userUtil.checkActiveStatus(otpEntity.getEmail());
        if (user == null) {
          throw new BadRequestException(
              languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
        }
        otpEntity.setStatus(Otp.Status.INACTIVE.value);
        otpRepository.save(otpEntity);
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
    User user = userUtil.checkUserOtpVerified(email);
    // If the user is null, the email was not found or not verified, throw a
    // BadRequestException
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    }
    String roleId = String.format(Constants.DIGIT_FORMAT, user.getRole().ordinal());
    Duration duration = Duration.ofMinutes(ex);
    TokenGenerator.Token emailToken = tokenGenerator.create(tokenType, email, roleId, duration);
    return new EmailTokenView(Constants.SUCCESSFULLY_CREATED, emailToken.value, LocalTime.now().plus(duration));
  }

  // Method to handle user login
  public UserLoginView login(UserLoginForm form) throws BadRequestException {
    User user = userUtil.checkActiveStatus(form.getEmail());
    // Checks if user is found
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    } else {
      if (!passwordEncoder.matches(form.getPassword(), user.getPassword())) {
        // If the password doesn't match, throw email or password incorrect error
        // message
        throw new BadRequestException(
            languageUtil.getTranslatedText(Constants.EMAIL_PASSWORD_INCORRECT, null, globalLanguage));
      }
    }
    String id = String.format(Constants.DIGIT_FORMAT, user.getId());
    String roleId = String.format(Constants.DIGIT_FORMAT, user.getRole().ordinal());
    TokenGenerator.Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());
    TokenGenerator.Token refreshToken = tokenGenerator.create(Constants.PURPOSE_REFRESH_TOKEN, id + user.getPassword(),
        roleId, securityConfig.getRefreshTokenExpiry());
    logger.info("User Login Successfully");
    return new UserLoginView(user, accessToken, refreshToken);
  }

  // This method refreshes the access token using the provided refresh token from
  // form
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
    User user = userRepository.findByIdAndPasswordAndStatus(userid, password, User.Status.ACTIVE.value).orElseThrow(
        () -> new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage)));
    String role = String.format(Constants.DIGIT_FORMAT, user.getRole().ordinal());
    String id = String.format(Constants.DIGIT_FORMAT, user.getId());
    Token accessToken = tokenGenerator.create(Constants.PURPOSE_ACCESS_TOKEN, id, role,
        securityConfig.getAccessTokenExpiry());
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }

  // Authentication of google sign in user with google token
  @Override
  public UserLoginView googleAuth(GoogleSignInForm form, Byte userRole) throws GeneralSecurityException, IOException {
    var token = form.getCredential();
    GoogleIdToken idToken = verifyToken(token);
    String name = idToken.getPayload().get("name").toString();
    String email = idToken.getPayload().getEmail();
    // Check if the user with the given email already exists in the database
    if (userRepository.existsByEmail(email)) {
      User user = userRepository.findByEmail(email);
      return handleExistingUser(user);
    } else {
      // else create a new entry with the provided email and name
      return handleNewUser(email, name);
    }
  }

  /**
   * This method verifies the Google ID token received from the client-side. It
   * uses Google's libraries to perform the verification.
   */
  private GoogleIdToken verifyToken(String token) throws GeneralSecurityException, IOException {
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), // for the network layer.
        new GsonFactory() // handle JSON parsing.
    ).setAudience(Collections.singletonList(googleId)).build();
    try {
      GoogleIdToken idToken = verifier.verify(token);
      // If the token verification fails, throw a BadRequestException with invalid
      // token as message.
      if (idToken == null) {
        throw new BadRequestException(languageUtil.getTranslatedText("googleToken.invalid", null, globalLanguage));
      } else {
        // else, the token verification is successful, return the verified GoogleIdToken
        return idToken;
      }
    } catch (IllegalArgumentException e) {
      throw new BadRequestException(languageUtil.getTranslatedText("googleToken.invalid", null, globalLanguage));
    }
  }

  // Handle an existing user based on their status
  private UserLoginView handleExistingUser(User user) {
    switch (user.getStatus()) {
    case 0:
      return userUtil.generateTokenForActiveUser(user);
    case 3:
      user.setStatus(User.Status.ACTIVE.value);
      userRepository.save(user);
      return userUtil.generateTokenForActiveUser(user);
    default:
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.UNABLE_TO_PERFORM, null, globalLanguage));
    }
  }

  // Handles the creation of a new user in the system during google signin
  private UserLoginView handleNewUser(String email, String name) {
    User newUser = new User(email, name);
    userRepository.save(newUser);
    User user = userRepository.findByEmail(email);
    new UserView(user);
    return userUtil.generateTokenForActiveUser(user);
  }

  /**
   * Initiates the password reset process by generating an OTP and sending it to
   * the user's email.
   *
   * @param form The ForgotPasswordEmailForm containing the user's email.
   * @return An OtpView object containing the email token and OTP details.
   * @throws BadRequestException if the provided email is not associated with any
   *                             active user.
   */
  @Override
  public OtpView forgotPassword(@Valid ForgotPasswordEmailForm form) {
    User user = userUtil.checkActiveStatus(form.getEmail());
    // Checks for user is present
    if (user != null) {
      Otp otp = verifyUtil.generateOtp(form.getEmail(), Constants.FORGOT_PASSWORD_TEMPLATE);
      EmailTokenView emailTokenView = generateForgotPasswordToken(form.getEmail(), Constants.FORGOT_PASSWORD_TOKEN);
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      // If the user's email is not found or is not associated with an active account,
      // throw a BadRequestException with an appropriate error message.
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    }
  }

  /**
   * Generates a forgot password purpose token with the provided email
   *
   * @param email     The email for which the token is generated.
   * @param tokenType The type of token to be generated - purpose.
   * @return An EmailTokenView containing the generated token and its expiration
   *         time.
   * @throws BadRequestException if the email is not found.
   */
  public EmailTokenView generateForgotPasswordToken(String email, String tokenType) {
    User user = userUtil.checkActiveStatus(email);
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    }
    String roleId = String.format(Constants.DIGIT_FORMAT, user.getRole().ordinal());
    Duration duration = Duration.ofMinutes(ex);
    TokenGenerator.Token emailToken = tokenGenerator.create(tokenType, email, roleId, duration);
    return new EmailTokenView(Constants.SUCCESSFULLY_CREATED, emailToken.value, LocalTime.now().plus(duration));
  }

  /**
   * Sets the password for a user using the provided form data.
   *
   * @param form The ForgotPasswordForm containing the purpose toke and the new
   *             password.
   * @return ResponseEntity with a success status if the password is set
   *         successfully.
   * @throws BadRequestException if the email provided in the form is not found or
   *                             is a non active user.
   */
  @Override
  public ResponseEntity<String> setPassword(@Valid ForgotPasswordForm form) {
    VerificationStatus status = verifyUtil.verifyPurposeToken(Constants.PURPOSE_SET_PASSWORD, form.getEmailToken());
    String email = status.data;
    User user = userRepository.findByEmailAndStatus(email, User.Status.ACTIVE.value);
    // checks for user is present
    if (user != null) {
      user.setPassword(passwordEncoder.encode(form.getPassword()));
      userRepository.save(user);
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      // else the user is not found or is inactive, throw a BadRequestException
      throw new BadRequestException(languageUtil.getTranslatedText(Constants.EMAIL_NOT_FOUND, null, globalLanguage));
    }
  }
}
