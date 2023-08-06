package com.innovature.eventmanagement.form.validation;
import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.*;

@Target({ElementType.FIELD, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = GenderValidator.class)
public @interface GenderMatch {

    String message() default "{gender.invalid}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
