package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.entity.Organizer;
import com.innovature.eventmanagement.entity.Organizer.Status;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class OrganizerUtil {

  private static final String USER_INACTIVE = "user.blocked";
  private static final String USER_DELETED = "user.deleted";
  private static final String USER_NOTFOUND = "email.not.found";

  @Autowired
  private LanguageUtil languageUtil;

  @Value("${global.language}")
  private String globalLanguage;

  @Autowired
  private OrganizerRepository organizerRepository;

  // For checking user is having otp verified status
  public Organizer checkUserOtpVerified(String email) {
    Organizer organizer = organizerRepository.findByEmailAndStatus(email, Status.OTP_NOT_VERIFIED.value);
    if (organizer == null) {
      return null;
    } else {
      return organizer;
    }
  }

  // For checking user is having active status
  public Organizer checkActiveStatus(String email) {
    Organizer organizer = organizerRepository.findByEmail(email);
    if (organizer != null) {
      byte status = organizer.getStatus();
      if (status == Status.ACTIVE.value) {
        // Organizer is ACTIVE, return the organizer object
        return organizer;
      } else if (status == Status.INACTIVE.value) {
        String errorMessage = languageUtil.getTranslatedText(USER_INACTIVE, null, globalLanguage);
        throw new BadRequestException(errorMessage);
      } else if (status == Status.DELETE.value) {
        String errorMessage = languageUtil.getTranslatedText(USER_DELETED, null, globalLanguage);
        throw new BadRequestException(errorMessage);
      } else {
        // Handle other status values (e.g., OTP_NOT_VERIFIED)
        String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, globalLanguage);
        throw new BadRequestException(errorMessage);
      }
    } else {
      // Organizer not found with the given email
      String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, globalLanguage);
      throw new BadRequestException(errorMessage);
    }
  }
}
