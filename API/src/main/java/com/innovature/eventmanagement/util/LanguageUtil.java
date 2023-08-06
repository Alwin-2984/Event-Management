package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.exception.BadRequestException;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;

public class LanguageUtil {

  @Autowired
  private MessageSource messageSource;

  public String getTranslatedText(String msgKey, Object[] obj, String lang) {
    if (!lang.equals("en")) {
      throw new BadRequestException(getTranslatedText("language.not.supported", null, "en"));
    }
    return messageSource.getMessage(msgKey, obj, Locale.ENGLISH);
  }
}
