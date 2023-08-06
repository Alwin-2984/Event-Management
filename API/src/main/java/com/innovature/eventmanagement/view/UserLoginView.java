package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.json.Json;
import com.innovature.eventmanagement.security.util.TokenGenerator;

import java.util.Date;

import com.innovature.eventmanagement.entity.User;
import lombok.Getter;

@Getter
public class UserLoginView extends UserView {
    public static class TokenView {

        private final String value;
        @Json.DateTimeFormat
        private final Date expiry;

        public TokenView(TokenGenerator.Token token) {
            this.value = token.value;
            this.expiry = new Date(token.expiry);
        }

        public TokenView(String value, long expiry) {
            this.value = value;
            this.expiry = new Date(expiry);
        }

        public String getValue() {
            return value;
        }

        public Date getExpiry() {
            return expiry;
        }
    }

    private final TokenView accessToken;
    private final TokenView refreshToken;

    public UserLoginView(User user, TokenGenerator.Token accessToken, TokenGenerator.Token refreshToken) {
        super(user);
        this.accessToken = new TokenView(accessToken);
        this.refreshToken = new TokenView(refreshToken);
    }

    public UserLoginView(User user, TokenView accessToken, TokenView refreshToken) {
        super(user);
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
