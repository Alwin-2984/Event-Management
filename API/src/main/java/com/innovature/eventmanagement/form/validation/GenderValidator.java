package com.innovature.eventmanagement.form.validation;

import com.innovature.eventmanagement.entity.User.Gender;
import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

// Custom validation annotation for gender validation
public class GenderValidator implements ConstraintValidator<GenderMatch, Byte> {

  // This method initializes the validator and can be used for any setup if needed
  @Override
  public void initialize(GenderMatch constraintAnnotation) {
    // Initialization code, if necessary
  }

  // This method performs the actual validation logic
  @Override
  public boolean isValid(Byte value, ConstraintValidatorContext context) {
    // If the value is null, it's considered valid (no validation required)
    if (value == null) {
      return true;
    }

    // Check if the provided value matches one of the valid gender values
    return (value == Gender.MALE.value || value == Gender.FEMALE.value || value == Gender.OTHER.value);
  }
}
