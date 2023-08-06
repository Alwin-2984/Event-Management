package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.entity.User;
import com.innovature.eventmanagement.entity.User.Status;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.repository.UserRepository;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.view.UserLoginView;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserUtil {

  private static final String DIGIT_FORMAT = "%10d";
  private static final String PURPOSE_REFRESH_TOKEN = "REFRESH_TOKEN";
  private static final String PURPOSE_ACCESS_TOKEN = "ACCESS_TOKEN";
  private static final String USER_INACTIVE = "user.blocked";
  private static final String USER_DELETED = "user.deleted";
  private static final String USER_NOTFOUND="email.not.found";
  @Autowired
  private TokenGenerator tokenGenerator;

  @Autowired
  private SecurityConfig securityConfig;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private LanguageUtil languageUtil;

  public User checkUserOtpVerified(String email) {
    User user = userRepository.findByEmailAndStatus(email, Status.OTP_NOT_VERIFIED.value);
    if (user == null) {
      return null;
    } else {
      return user;
    }
  }

  public User checkActiveStatus(String email) {
    User user = userRepository.findByEmail(email);
    if (user != null) {
        byte status = user.getStatus();
        if (status == Status.ACTIVE.value) {
            // User is ACTIVE, return the user object
            return user;
        } else if (status == Status.INACTIVE.value) {
            // User is INACTIVE, throw BadRequestException with the corresponding message
            String errorMessage = languageUtil.getTranslatedText(USER_INACTIVE, null, "en");
            throw new BadRequestException(errorMessage);
        } else if (status == Status.DELETE.value) {
            // User is DELETED, throw BadRequestException with the corresponding message
            String errorMessage = languageUtil.getTranslatedText(USER_DELETED, null, "en");
            throw new BadRequestException(errorMessage);
        } else {
            // Handle other status values (e.g., OTP_NOT_VERIFIED)
            String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, "en");
            throw new BadRequestException(errorMessage);
        }
    } else {
        // User not found with the given email
        String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, "en");
        throw new BadRequestException(errorMessage);
    }
}
  public UserLoginView generateTokenForActiveUser(User user) {
    String roleId = String.format(DIGIT_FORMAT, user.getRole().ordinal());
    String id = String.format(DIGIT_FORMAT, user.getId());
    TokenGenerator.Token accessToken = tokenGenerator.create(PURPOSE_ACCESS_TOKEN, id, roleId,
        securityConfig.getAccessTokenExpiry());
    TokenGenerator.Token refreshToken = tokenGenerator.create(PURPOSE_REFRESH_TOKEN, id + user.getPassword(), roleId,
        securityConfig.getRefreshTokenExpiry());
    return new UserLoginView(user, accessToken, refreshToken);
  }
}
