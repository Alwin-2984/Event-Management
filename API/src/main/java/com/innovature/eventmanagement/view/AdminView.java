package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.Admin;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class AdminView {

    private final int id;
    private final String email;
    private final String role;

    public AdminView(Admin admin) {
        this.id = admin.getId();
        this.email = admin.getEmail();
        this.role = admin.getRole().name();
    }
}
