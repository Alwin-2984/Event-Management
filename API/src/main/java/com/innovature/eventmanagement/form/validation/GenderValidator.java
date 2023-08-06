package com.innovature.eventmanagement.form.validation;

import com.innovature.eventmanagement.entity.User.Gender;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

public class GenderValidator implements ConstraintValidator<GenderMatch, Byte> {

  @Override
  public boolean isValid(Byte value, ConstraintValidatorContext context) {
    if (value == null) {
      return true;
    }

    return (
      value == Gender.MALE.value ||
      value == Gender.FEMALE.value ||
      value == Gender.OTHER.value
    );
  }
}
