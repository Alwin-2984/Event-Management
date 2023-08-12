package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.Organizer;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class OrganizerListView {
    private long id;
    private String name;
    private String email;
    private byte status;

    public OrganizerListView(Organizer organizer){
        this.id = organizer.getId();
        this.name = organizer.getName();
        this.email = organizer.getEmail();
        this.status = organizer.getStatus();
    }
}
