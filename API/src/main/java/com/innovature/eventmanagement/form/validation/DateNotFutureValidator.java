package com.innovature.eventmanagement.form.validation;

import java.util.Date;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

/**
 * Custom validator to ensure that a given date is not in the future.
 */
public class DateNotFutureValidator implements ConstraintValidator<DateNotFuture, Date> {

  /**
   * Validates that the provided date is not in the future.
   *
   * @param date    The date to be validated.
   * @param context The validation context.
   * @return True if the date is null or not in the future, otherwise false.
   */
  @Override
  public boolean isValid(Date date, ConstraintValidatorContext context) {
    // If the date is null, it's considered valid (not applicable).
    if (date == null) {
      return true;
    }

    Date currentDate = new Date();
    // Compare the provided date with the current date.
    // If the provided date is not after the current date, it's considered valid.
    return !date.after(currentDate);
  }
}
