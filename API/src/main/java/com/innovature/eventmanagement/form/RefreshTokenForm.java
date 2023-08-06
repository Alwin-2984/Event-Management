package com.innovature.eventmanagement.form;

import lombok.Getter;
import lombok.Setter;
import javax.validation.constraints.NotBlank;

@Getter
@Setter
public class RefreshTokenForm {

    @NotBlank(message = "{refreshToken.should.required}")
    private String refreshToken;
    
}