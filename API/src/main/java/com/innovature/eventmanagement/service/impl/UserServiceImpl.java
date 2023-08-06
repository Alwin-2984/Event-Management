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

@Service
public class UserServiceImpl implements UserService {

  @Value("${google.id}")
  private String googleId;

  private final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);
  private static final String EMAIL_NOT_FOUND = "email.not.found";
  private static final String EMAIL_PASSWORD_INCORRECT = "email.password.incorrect";
  public static final String PURPOSE_ACCESS_TOKEN = "ACCESS_TOKEN";
  private static final String PURPOSE_REFRESH_TOKEN = "REFRESH_TOKEN";
  private static final String PURPOSE_EMAIL_TOKEN = "EMAIL_TOKEN";
  private static final String FORGOT_PASSWORD_TOKEN = "FORGOT_PASSWORD_TOKEN";
  private static final String EMAIL_ALREADY_EXIST = "email.already.exist";
  private static final String UNABLE_TO_PERFORM = "unable.to.perform.this.action";
  private static final String DIGIT_FORMAT = "%10d";
  private static final String PURPOSE_SET_PASSWORD = "PURPOSE_SET_PASSWORD";
  public static final String SUCCESSFULLY_CREATED = "successfully created";
  public static final String EMAIL_VERIFICATION_TEMPLATE = "signupEmailContent";
  public static final String FORGOT_PASSWORD_TEMPLATE = "forgotPasswordEmailContent";
  @Autowired
  private VerifyUtil verifyUtil;

  @Autowired
  private OtpRepository otpRepository;

  @Autowired
  private LanguageUtil languageUtil;

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
    // Check if the user with the provided email has already been verified via OTP
    User user = userUtil.checkUserOtpVerified(form.getEmail());
    if (user == null) {
      // The user is not found with OTP_NOT_VERIFIED status,
      // so check if the user exists with other status - if found displays email
      // already exist message.
      User existingUser = userRepository.findByEmail(form.getEmail());
      if (existingUser != null) {
        throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_ALREADY_EXIST, null, "en"));
      }

      // User with email doesn't exist, so proceed with OTP generation and
      // registration and sends email.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), EMAIL_VERIFICATION_TEMPLATE);
      // Create a new user with the provided details and save to the database
      userRepository.save(new User(form.getEmail(), passwordEncoder.encode(form.getPassword()), form.getName(),
          form.getGender(), form.getDob()));

      // Generate and return an OtpView object with email token information and OTP
      // expiry
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), PURPOSE_EMAIL_TOKEN);

      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      // User with "OTP_NOT_VERIFIED" status already exists, so generate a new OTP and
      // sends mail.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), EMAIL_VERIFICATION_TEMPLATE);

      // Update the existing user with the provided details and save changes to the
      // database
      user.setName(form.getName());
      user.setDob(form.getDob());
      user.setGender(form.getGender());
      user.setPassword(passwordEncoder.encode(form.getPassword()));
      userRepository.save(user);

      // Generate and return an OtpView object with email token details and OTP expiry
      EmailTokenView emailTokenView = generateVerifyOtpToken(form.getEmail(), PURPOSE_EMAIL_TOKEN);

      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    }
  }

  /**
   * Method to verify the OTP and emailtoken provided in the OtpForm . It returns
   * a ResponseEntity with HTTP status OK if the OTP is successfully verified.
   */
  public ResponseEntity<String> verify(@Valid OtpForm form) {
    // Verify the email verification token.
    VerificationStatus status = verifyUtil.verifyPurposeToken(PURPOSE_EMAIL_TOKEN, form.getEmailToken());
    // Get the email address from the verification status data.
    String email = status.data;
    // Retrieve the OTP object from the otpRepository based on the email and ACTIVE
    // status.
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);
    // Check if the OTP object exists and if the OTP provided in the form matches.
    if (otp != null && Boolean.TRUE.equals(verifyOtp(otp, form.getOtp()))) {
      // Return an HTTP OK response if the OTP is valid.
      return new ResponseEntity<>(HttpStatus.OK);
    }
    // If OTP verification fails due to reverifying with otp, throws a
    // BadRequestException with an error message.
    throw new BadRequestException(languageUtil.getTranslatedText(UNABLE_TO_PERFORM, null, "en"));
  }

  /**
   * Method to verify the OTP for forgot password from emailtoken provided in the
   * OtpForm . It returns a ResponseEntity with HTTP status OK if the OTP is
   * successfully verified.
   */
  public EmailTokenView verifyForgotPasswordToken(@Valid OtpForm form) {
    // Verify the email verification token.
    VerificationStatus status = verifyUtil.verifyPurposeToken(FORGOT_PASSWORD_TOKEN, form.getEmailToken());
    // Get the email address from the verification status data.
    String email = status.data;
    // Retrieve the OTP object from the otpRepository based on the email and ACTIVE
    // status.
    Otp otp = otpRepository.findByEmailAndStatus(email, Otp.Status.ACTIVE.value);
    // Check if the OTP object exists and if the OTP provided in the form matches.
    if (otp != null && Boolean.TRUE.equals(forgotPasswordVerifyOtp(otp, form.getOtp()))) {
      EmailTokenView emailTokenView = generateForgotPasswordToken(email, PURPOSE_SET_PASSWORD);
      return new EmailTokenView("OTP Verified successfully", emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry());
    }
    // If OTP verification fails due to reverifying with otp, throws a
    // BadRequestException with an error message.
    throw new BadRequestException(languageUtil.getTranslatedText(UNABLE_TO_PERFORM, null, "en"));
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
    // Get the current time
    LocalTime myObj = LocalTime.now();

    // Calculate the difference between the current time and the OTP's expiry time
    // in seconds
    var expDiff = myObj.until(otpEntity.getExpiry(), ChronoUnit.SECONDS);

    // Check if the provided OTP matches the stored OTP
    if ((otp.equals(otpEntity.getOtp()))) {
      // Check if the OTP is still valid (not expired)
      if (expDiff > 0) {
        // Retrieve the user with the provided email from the OTP entity
        User user = userUtil.checkUserOtpVerified(otpEntity.getEmail());

        // If no user is found, throw a BadRequestException with email not found error
        // message
        if (user == null) {
          throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
        }

        // Activate the user by setting the user's status to ACTIVE
        user.setStatus(User.Status.ACTIVE.value);

        // Set the OTP status to INACTIVE as it has been used
        otpEntity.setStatus(Otp.Status.INACTIVE.value);

        // Save the updated OTP entity and user in the respective repositories
        otpRepository.save(otpEntity);
        userRepository.save(user);

        // Return true to on successfull verification
        return true;
      }

      // If the OTP is expired, throw a BadRequestException with an appropriate error
      // message
      throw new BadRequestException(languageUtil.getTranslatedText("otp.expired", null, "en"));
    }

    // If the provided OTP is incorrect, throw a BadRequestException with an
    // appropriate error message
    throw new BadRequestException(languageUtil.getTranslatedText("incorrect.otp", null, "en"));
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
    // Get the current time
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

        // If no user is found, throw a BadRequestException with email not found error
        // message
        if (user == null) {
          throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
        }

        // Set the OTP status to INACTIVE as it has been used
        otpEntity.setStatus(Otp.Status.INACTIVE.value);

        // Save the updated OTP respective repositoriy
        otpRepository.save(otpEntity);

        // Return true to on successfull verification
        return true;
      }

      // If the OTP is expired, throw a BadRequestException with an appropriate error
      // message
      throw new BadRequestException(languageUtil.getTranslatedText("otp.expired", null, "en"));
    }

    // If the provided OTP is incorrect, throw a BadRequestException with an
    // appropriate error message
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
    // Check if the user associated with the email has verified OTP
    User user = userUtil.checkUserOtpVerified(email);
    // If the user is null, the email was not found or not verified, throw a
    // BadRequestException
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    }
    // Convert the user's role to a formatted string
    String roleId = String.format(DIGIT_FORMAT, user.getRole().ordinal());
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

  // Method to handle user login
  public UserLoginView login(UserLoginForm form) throws BadRequestException {
    // Check if the user is active based on the provided email
    User user = userUtil.checkActiveStatus(form.getEmail());

    // If the user is not found, throw a BadRequestException with an email not found
    // message
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    } else {
      // If the user is found, check if the provided password matches the user's
      // stored password
      if (!passwordEncoder.matches(form.getPassword(), user.getPassword())) {
        // If the password doesn't match, throw email or password incorrect error
        // message
        throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_PASSWORD_INCORRECT, null, "en"));
      }
    }

    // Format the user ID and role ID as per the specified format
    String id = String.format(DIGIT_FORMAT, user.getId());
    String roleId = String.format(DIGIT_FORMAT, user.getRole().ordinal());

    // Create an access token for the user with the specified purpose, user ID, role
    // ID, and expiry time
    TokenGenerator.Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());

    // Create a refresh token for the user with the specified purpose, user ID +
    // password, role ID, and expiry time
    TokenGenerator.Token refreshToken = tokenGenerator.create(PURPOSE_REFRESH_TOKEN, id + user.getPassword(), roleId,
        securityConfig.getRefreshTokenExpiry());

    // Log the successful user login
    logger.info("User Login Successfully");

    // Return a new UserLoginView containing the user information, access token, and
    // refresh token
    return new UserLoginView(user, accessToken, refreshToken);
  }

  // This method refreshes the access token using the provided refresh token from
  // form.
  public RefreshTokenView refresh(RefreshTokenForm form) throws BadRequestException {
    // Declare a variable to hold the verification status of the refresh token.
    VerificationStatus status;

    try {
      // Verify the refresh token using the token generator for the specific purpose.
      status = tokenGenerator.verify(PURPOSE_REFRESH_TOKEN, form.getRefreshToken());
    } catch (InvalidTokenException e) {
      // If the refresh token is invalid, throw a BadRequestException with token
      // invalid message.
      throw new BadRequestException("1091-Token is invalid", e);
    } catch (TokenExpiredException e) {
      // If the refresh token has expired, throw a BadRequestException with token
      // expired message.
      throw new BadRequestException("1090-Authorization token expired", e);
    }

    // Extract the user ID from the verification status data.
    int userid;
    try {
      userid = Integer.parseInt(status.data.substring(0, 10).trim());
    } catch (NumberFormatException e) {
      // If the user ID cannot be parsed, throw a BadRequestException with token
      // invalid message.
      throw new BadRequestException("1091-Token is invalid", e);
    }

    // Extract the password from the verification status data.
    String password = status.data.substring(10);

    // Find the user in the user repository using the user ID, password, and active
    // status.
    User user = userRepository.findByIdAndPasswordAndStatus(userid, password, User.Status.ACTIVE.value)
        .orElseThrow(() ->
        // If the user is not found, throw a BadRequestException with email not found
        // message.
        new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en")));

    // Format the user's role and ID as digits for creating the access token.
    String role = String.format(DIGIT_FORMAT, user.getRole().ordinal());
    String id = String.format(DIGIT_FORMAT, user.getId());

    // Create a new access token using the token generator with the appropriate
    // parameters.
    Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, role, securityConfig.getAccessTokenExpiry());

    // Return a new RefreshTokenView with the updated access token information.
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }

  @Override
  public UserLoginView googleAuth(GoogleSignInForm form, Byte userRole) throws GeneralSecurityException, IOException {
    // Get the Google OAuth2 token from the form
    var token = form.getCredential();

    // Verify the Google OAuth2 token to get the user's information
    GoogleIdToken idToken = verifyToken(token);

    // Extract the user's name from the token payload
    String name = idToken.getPayload().get("name").toString();

    // Extract the user's email from the token payload
    String email = idToken.getPayload().getEmail();

    // Check if the user with the given email already exists in the database
    if (userRepository.existsByEmail(email)) {
      // If the user exists, retrieve the user from the database
      User user = userRepository.findByEmail(email);

      // Handle the existing user and return the corresponding UserLoginView
      return handleExistingUser(user);
    } else {
      // If the user doesn't exist in the database, handle the new user and create a
      // new entry
      // with the provided email and name
      return handleNewUser(email, name);
    }
  }

  /**
   * This method verifies the Google ID token received from the client-side. It
   * uses Google's libraries to perform the verification.
   */
  private GoogleIdToken verifyToken(String token) throws GeneralSecurityException, IOException {
    // Initialize a GoogleIdTokenVerifier with the required configuration.
    GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), // for the network layer.
        new GsonFactory() // handle JSON parsing.
    ).setAudience(Collections.singletonList(googleId)) // Set the expected audience (client ID).
        .build();

    try {
      // Verify the token using the configured verifier.
      GoogleIdToken idToken = verifier.verify(token);

      // If the token verification fails, throw a BadRequestException with invalid
      // token as message.
      if (idToken == null) {
        throw new BadRequestException(languageUtil.getTranslatedText("googleToken.invalid", null, "en"));
      } else {
        // If the token verification is successful, return the verified GoogleIdToken
        // object.
        return idToken;
      }
    } catch (IllegalArgumentException e) {
      // If an IllegalArgumentException occurs during verification, throw a
      // BadRequestException.
      throw new BadRequestException(languageUtil.getTranslatedText("googleToken.invalid", null, "en"));
    }
  }

  // Handle an existing user based on their status
  private UserLoginView handleExistingUser(User user) {
    switch (user.getStatus()) {
    // If the user's status is 0 (Active), generate a token for an active user
    case 0 -> {
      return userUtil.generateTokenForActiveUser(user);
    }
    // If the user's status is 3 (OTP Not verified), update the status to ACTIVE and
    // save to the repository,
    // then generate a token for this user
    case 3 -> {
      user.setStatus(User.Status.ACTIVE.value);
      userRepository.save(user);
      return userUtil.generateTokenForActiveUser(user);
    }
    // For any other status, throw a BadRequestException with a unable to perform
    // message
    default -> {
      throw new BadRequestException((languageUtil.getTranslatedText(UNABLE_TO_PERFORM, null, "en")));
    }
    }
  }

  /**
   * This method handles the creation of a new user in the system. It takes the
   * user's email and name as parameters and returns a UserLoginView .
   */
  private UserLoginView handleNewUser(String email, String name) {
    // Create a new User object with the provided email and name
    User newUser = new User(email, name);
    // Save the newly created User object to the database.
    userRepository.save(newUser);
    // Retrieve the User object from the database based on the provided email.
    User user = userRepository.findByEmail(email);
    // Create a UserView object for the retrieved User.
    new UserView(user);
    // Generate access and refresh token for the created user.
    // The UserLoginView is returned with token informations.
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
    // Check if the user's email exists and is active in the system.
    User user = userUtil.checkActiveStatus(form.getEmail());

    if (user != null) {
      // Generate an OTP and sends to user's email.
      Otp otp = verifyUtil.generateOtp(form.getEmail(), FORGOT_PASSWORD_TEMPLATE);
      // Generate a token for the password reset process.
      EmailTokenView emailTokenView = generateForgotPasswordToken(form.getEmail(), FORGOT_PASSWORD_TOKEN);

      // Create and return an OtpView object with relevant details for the front-end.
      return new OtpView(emailTokenView.getMessage(), emailTokenView.getEmailToken(),
          emailTokenView.getEmailTokenExpiry(), otp.getExpiry());
    } else {
      // If the user's email is not found or is not associated with an active account,
      // throw a BadRequestException with an appropriate error message.
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
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
    // Check if the the email has active status
    User user = userUtil.checkActiveStatus(email);
    // If the user is null, throw a BadRequestException
    if (user == null) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    }
    // Convert the user's role to a formatted string
    String roleId = String.format(DIGIT_FORMAT, user.getRole().ordinal());
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
    // Verifies the password verification token
    VerificationStatus status = verifyUtil.verifyPurposeToken(PURPOSE_SET_PASSWORD, form.getEmailToken());

    // Get the email address from the verification status data.
    String email = status.data;

    // Find the user with the given email address and active status
    User user = userRepository.findByEmailAndStatus(email, User.Status.ACTIVE.value);

    if (user != null) {
      // Encode and set the new password for the user
      user.setPassword(passwordEncoder.encode(form.getPassword()));

      // Save the updated user object with the new password
      userRepository.save(user);

      // Return a success response
      return new ResponseEntity<>(HttpStatus.OK);
    } else {
      // If the user is not found or is inactive, throw a BadRequestException
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en"));
    }
  }
}
