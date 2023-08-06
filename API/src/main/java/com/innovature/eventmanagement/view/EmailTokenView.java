package com.innovature.eventmanagement.view;

import java.time.LocalTime;

import lombok.Getter;

@Getter
public class EmailTokenView {

    private final String message;
    private final String emailToken;
    private final LocalTime emailTokenExpiry;

    public EmailTokenView(String msg, String emailToken, LocalTime emailTokenExpiry) {
        this.message = msg;
        this.emailToken = emailToken;
        this.emailTokenExpiry = emailTokenExpiry;
    }

}
