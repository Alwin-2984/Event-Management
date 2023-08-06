package com.innovature.eventmanagement.form.validation;

import java.util.Date;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class DateNotFutureValidator
  implements ConstraintValidator<DateNotFuture, Date> {

  @Override
  public boolean isValid(Date date, ConstraintValidatorContext context) {
    if (date == null) {
      return true;
    }

    Date currentDate = new Date();
    return !date.after(currentDate);
  }
}
