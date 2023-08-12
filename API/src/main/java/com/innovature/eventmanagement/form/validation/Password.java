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

@NotBlank(message = "{password.required}")
@Size(message = "{password.size}", min = 8, max = 24)
@Pattern(regexp = "^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-+_={}\\[\\]|\\\\:;\"'<>,.?/])[a-zA-Z0-9 \\!\"#\\$%&'\\(\\)\\*\\+,\\-\\.\\/\\:;\\<\\=\\>\\?@\\[\\\\\\]\\^_`\\{\\|\\}~]+$", message = "{password.should.contain}")
@Target({ ANNOTATION_TYPE, FIELD, METHOD, PARAMETER, TYPE_USE })
@Retention(RUNTIME) // Specifies that the annotation should be available at runtime
@Constraint(validatedBy = {}) // Specifies the validator class for this constraint
@Documented
public @interface Password {
  /**
   * Default error message when validation fails.
   *
   * @return The error message.
   */
  String message() default "{javax.validation.constraints.Pattern.message}";

  /**
   * Groups the constraint belongs to.
   *
   * @return The groups.
   */
  Class<?>[] groups() default {};

  /**
   * Payload associated with the constraint.
   *
   * @return The payload.
   */
  Class<? extends Payload>[] payload() default {};
}
