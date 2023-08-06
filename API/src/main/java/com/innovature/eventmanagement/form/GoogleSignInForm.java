package com.innovature.eventmanagement.form;

import javax.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleSignInForm {

    @NotBlank(message = "{googleToken.required}")
    // @Pattern(regexp = "^(?!.*\\s)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\\-+_={}\\[\\]|\\\\:;\"'<>,.?/])[a-zA-Z0-9 \\!\"#\\$%&'\\(\\)\\*\\+,\\-\\.\\/\\:;\\<\\=\\>\\?@\\[\\\\\\]\\^_`\\{\\|\\}~]+$", message = "{googleToken.invalid}")
    private String credential;

}
