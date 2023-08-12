package com.innovature.eventmanagement.form.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

/**
 * Custom annotation to validate that a date is not in the future.
 */
@Target({ ElementType.FIELD, ElementType.METHOD }) // Specifies where the annotation can be applied (fields and methods)
@Retention(RetentionPolicy.RUNTIME) // Specifies that the annotation should be available at runtime
@Constraint(validatedBy = DateNotFutureValidator.class) // Specifies the validator class for this constraint
public @interface DateNotFuture {

    String message() default "{dob.invalid}"; // Default error message key

    Class<?>[] groups() default {}; // Validation groups

    Class<? extends Payload>[] payload() default {}; // Custom payload for the validation result
}