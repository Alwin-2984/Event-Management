package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.User;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class UserView {

    private final long id;
    private final String email;
    private final String role;

    public UserView(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.role = user.getRole().name();

    }
}
