package com.innovature.eventmanagement.form.validation;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Documented;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;

@NotBlank(message = "{name.required}")
@Size(min = 3, max = 20, message = "{name.size}")
@Pattern(regexp = "^[a-zA-Z]+(\\s[a-zA-Z]+)*$", message = "{name.invalid}")
@Target({ ANNOTATION_TYPE, FIELD, METHOD, PARAMETER, TYPE_USE })
@Retention(RUNTIME) // Specifies that the annotation should be available at runtime
@Constraint(validatedBy = {}) // Specifies the validator class for this constraint
@Documented
public @interface Name {
  /**
   * Default validation error message. This message will be used if the validation
   * fails. The placeholder {javax.validation.constraints.Pattern.message} will be
   * replaced with the actual error message defined in the validation framework.
   */
  String message() default "{javax.validation.constraints.Pattern.message}";

  /**
   * Specifies the validation groups to which this constraint belongs. Useful for
   * categorizing constraints and applying them selectively.
   */
  Class<?>[] groups() default {};

  /**
   * Custom payload that can provide additional information about the validation
   * error. Typically used for advanced error handling and reporting.
   */
  Class<? extends Payload>[] payload() default {};
}
