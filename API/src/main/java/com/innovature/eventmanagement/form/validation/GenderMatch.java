package com.innovature.eventmanagement.form.validation;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ ElementType.FIELD, ElementType.METHOD })
@Retention(RetentionPolicy.RUNTIME) // Specifies that the annotation should be available at runtime
@Constraint(validatedBy = GenderValidator.class) // Specifies the validator class for this constraint
public @interface GenderMatch {

    String message() default "{gender.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
