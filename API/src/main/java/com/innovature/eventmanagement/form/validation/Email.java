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

/**
 * Custom annotation to validate if a String represents a valid email address
 * format. This annotation can be used on fields, methods, parameters, and other
 * elements.
 */
@NotBlank(message = "{email.required}")
@Size(max = 255, message = "{email.max.length}")
@Pattern(regexp = "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z]+$", message = "{email.invalid}")
@Target({ ANNOTATION_TYPE, FIELD, METHOD, PARAMETER, TYPE_USE })
@Retention(RUNTIME) // Specifies that the annotation should be available at runtime
@Constraint(validatedBy = {}) // Specifies the validator class for this constraint
@Documented
public @interface Email {

  /**
   * Default error message to be used if validation fails. The message can be
   * overridden when applying the annotation.
   */
  String message() default "{javax.validation.constraints.Pattern.message}";

  /**
   * Specifies the validation groups this constraint belongs to. It allows you to
   * define different validation groups for different scenarios.
   */
  Class<?>[] groups() default {};

  /**
   * Specifies custom payloads for advanced scenarios. Payloads allow you to
   * associate additional metadata with a validation error.
   */
  Class<? extends Payload>[] payload() default {};
}
