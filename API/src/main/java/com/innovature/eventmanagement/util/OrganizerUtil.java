package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.entity.Organizer;
import com.innovature.eventmanagement.entity.Organizer.Status;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.repository.OrganizerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class OrganizerUtil {
  private static final String USER_INACTIVE = "user.blocked";
  private static final String USER_DELETED = "user.deleted";
  private static final String USER_NOTFOUND="email.not.found";
  @Autowired
  private LanguageUtil languageUtil;
  @Autowired
  private OrganizerRepository organizerRepository;

  public Organizer checkUserOtpVerified(String email) {
    Organizer organizer = organizerRepository.findByEmailAndStatus(email, Status.OTP_NOT_VERIFIED.value);
    if (organizer == null) {
      return null;
    } else {
      return organizer;
    }
  }

  public Organizer checkActiveStatus(String email) {
    Organizer organizer = organizerRepository.findByEmail(email);
    if (organizer != null) {
        byte status = organizer.getStatus();
        if (status == Status.ACTIVE.value) {
            // Organizer is ACTIVE, return the organizer object
            return organizer;
        } else if (status == Status.INACTIVE.value) {
            // Organizer is INACTIVE, throw BadRequestException with the corresponding message
            String errorMessage = languageUtil.getTranslatedText(USER_INACTIVE, null, "en");
            throw new BadRequestException(errorMessage);
        } else if (status == Status.DELETE.value) {
            // Organizer is DELETED, throw BadRequestException with the corresponding message
            String errorMessage = languageUtil.getTranslatedText(USER_DELETED, null, "en");
            throw new BadRequestException(errorMessage);
        } else {
            // Handle other status values (e.g., OTP_NOT_VERIFIED)
            String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, "en");
            throw new BadRequestException(errorMessage);
        }
    } else {
        // Organizer not found with the given email
        String errorMessage = languageUtil.getTranslatedText(USER_NOTFOUND, null, "en");
        throw new BadRequestException(errorMessage);
    }
}
}
