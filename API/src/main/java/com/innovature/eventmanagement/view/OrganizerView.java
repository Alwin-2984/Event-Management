package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.Organizer;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class OrganizerView {

    private final long id;
    private final String email;
    private final String role;

    public OrganizerView(Organizer organizer) {
        this.id = organizer.getId();
        this.email = organizer.getEmail();
        this.role = organizer.getRole().name();

    }
}
