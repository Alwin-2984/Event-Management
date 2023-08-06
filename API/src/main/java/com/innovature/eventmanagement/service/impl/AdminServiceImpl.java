package com.innovature.eventmanagement.service.impl;

import com.innovature.eventmanagement.entity.Admin;
import com.innovature.eventmanagement.entity.User;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.form.AdminLoginForm;
import com.innovature.eventmanagement.form.RefreshTokenForm;
import com.innovature.eventmanagement.repository.AdminRepository;
import com.innovature.eventmanagement.repository.UserRepository;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.InvalidTokenException;
import com.innovature.eventmanagement.security.util.TokenExpiredException;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.security.util.TokenGenerator.Token;
import com.innovature.eventmanagement.security.util.TokenGenerator.VerificationStatus;
import com.innovature.eventmanagement.service.AdminService;
import com.innovature.eventmanagement.util.LanguageUtil;
import com.innovature.eventmanagement.util.Pager;
import com.innovature.eventmanagement.view.AdminLoginView;
import com.innovature.eventmanagement.view.RefreshTokenView;
import com.innovature.eventmanagement.view.UserListView;
import com.innovature.eventmanagement.view.countView;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/*
 * Description : Admin Service Implementation
 * Author Name : Manu Ravi
 */
@Service
public class AdminServiceImpl implements AdminService {

  private static final String EMAIL_NOT_FOUND = "email.not.found";
  private static final String UNABLE_TO_PERFORM = "unable.to.perform.this.action";
  private final Logger logger = LoggerFactory.getLogger(AdminServiceImpl.class);
  private static final String EMAIL_PASSWORD_INCORRECT = "email.password.incorrect";
  public static final String PURPOSE_ACCESS_TOKEN = "ACCESS_TOKEN";
  private static final String PURPOSE_REFRESH_TOKEN = "REFRESH_TOKEN";
  private static final String DIGIT_FORMAT = "%10d";
  private static final String INVALID_ID = "id.invalid";
  private static final String INVALID_STATUS = "status.invalid";
  private static final String USER_DELETED = "user.deleted";

  @Autowired
  private AdminRepository adminRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private LanguageUtil languageUtil;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Autowired
  private SecurityConfig securityConfig;

  @Autowired
  private TokenGenerator tokenGenerator;

  // Log in an admin using the provided login form.

  @Override
  public AdminLoginView login(AdminLoginForm form) {
    Admin admin = adminRepository.findByEmail(form.getEmail())
        .orElseThrow(() -> new BadRequestException(languageUtil.getTranslatedText(EMAIL_NOT_FOUND, null, "en")));
    // Check if the provided password matches the admin's stored password.
    if (!passwordEncoder.matches(form.getPassword(), admin.getPassword())) {
      throw new BadRequestException(languageUtil.getTranslatedText(EMAIL_PASSWORD_INCORRECT, null, "en"));
    }
    String id = String.format(DIGIT_FORMAT, admin.getId());
    String roleId = String.format(DIGIT_FORMAT, admin.getRole().ordinal());
    // creates accesstoken with Purpose, id, roleid, expiry
    TokenGenerator.Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());
    // creates refreshtoken with Purpose, id, password, roleid, expiry
    TokenGenerator.Token refreshToken = tokenGenerator.create(PURPOSE_REFRESH_TOKEN, id + admin.getPassword(), roleId,
        securityConfig.getRefreshTokenExpiry());
    logger.info("Admin Login Successfully");

    return new AdminLoginView(admin, accessToken, refreshToken);
  }

  // Method to refresh an access token using a refresh token
  @Override
  public RefreshTokenView refresh(RefreshTokenForm form) throws BadRequestException {
    VerificationStatus status;

    try {
      status = tokenGenerator.verify(PURPOSE_REFRESH_TOKEN, form.getRefreshToken());
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

    Admin admin = adminRepository.findByIdAndPassword(userid, password)
        .orElseThrow(() -> new BadRequestException(languageUtil.getTranslatedText(UNABLE_TO_PERFORM, null, "en")));

    String role = String.format(DIGIT_FORMAT, admin.getRole().ordinal());
    String id = String.format(DIGIT_FORMAT, admin.getId());

    // Generate a new access token for the admin user
    Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, role, securityConfig.getAccessTokenExpiry());

    // Create and return new access and refresh tokens
    return new RefreshTokenView(new RefreshTokenView.TokenView(accessToken.value, accessToken.expiry),
        new RefreshTokenView.TokenView(form.getRefreshToken(), status.expiry));
  }

  @Override
  public Pager<UserListView> listUsers(String search, Integer page, Integer size, String sort, Integer order,
      Integer status) {
    // Validate the page parameter
    if (page < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText("Page.natual", null, "en"));
    }

    // Validate the size parameter
    if (size < 1) {
      throw new BadRequestException(languageUtil.getTranslatedText("Size.natural", null, "en"));
    }
    Direction direction;
    // Validate the order parameter
    if (order == 1) {
      direction = Direction.DESC;
    } else {
      direction = Direction.ASC;
    }
    
    Pager<UserListView> userPager;
    List<UserListView> userList;
    int countData;
    userList = StreamSupport
        .stream(userRepository.findByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status, search,
            search, PageRequest.of(page - 1, size, direction, sort)).spliterator(), false)
        .map(UserListView::new).collect(Collectors.toList());

    countData = userRepository.countByStatusInAndNameContainingIgnoreCaseOrEmailContainingIgnoreCase(status, search,
        search);

    // Create a Pager object to hold the results and return it
    userPager = new Pager<>(size, countData, page);
    userPager.setResult(userList);
    return userPager;
  }

  // Retrieves the count of active users from the database
  @Override
  public countView getActiveUserCount() {
    long activeUserCount = userRepository.countByStatus(User.Status.ACTIVE.value);
    return new countView(activeUserCount);
  }

  @GetMapping("/user/manageUser/{id}/{status}")
  public ResponseEntity<String> manageUser(@PathVariable String id, @PathVariable String status) {
    try {
      long userId = Long.parseLong(id);
      User user = userRepository.findById(userId).orElseThrow(() -> new BadRequestException("User not found"));
      if (user.getStatus() == User.Status.DELETE.value) {
        // User is DELETED, throw BadRequestException with the corresponding message
        String errorMessage = languageUtil.getTranslatedText(USER_DELETED, null, "en");
        throw new BadRequestException(errorMessage);
      }
      // Validate the 'status' parameter to make sure it's one of the allowed values
      // (0, 1, or 2)
      if (!status.matches("[012]")) {
        throw new BadRequestException(languageUtil.getTranslatedText(INVALID_STATUS, null, "en"));
      }
      byte statusValue = Byte.parseByte(status);
      user.setStatus(statusValue);
      userRepository.save(user);
      return new ResponseEntity<>(HttpStatus.OK);
    } catch (NumberFormatException ex) {
      throw new BadRequestException(languageUtil.getTranslatedText(INVALID_ID, null, "en"));
    }
  }
}
