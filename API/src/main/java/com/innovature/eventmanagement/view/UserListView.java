package com.innovature.eventmanagement.view;
import lombok.Getter;
import lombok.NoArgsConstructor;
import java.util.Date;
import com.innovature.eventmanagement.entity.User;

@Getter
@NoArgsConstructor(force = true)
public class UserListView {
    private long id;
    private String name;
    private String email;
    private Date dob;
    private byte status;
    private Byte gender;

    public UserListView(User user) {
        this.id=user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.dob = user.getDob();
        this.status = user.getStatus();
        this.gender = user.getGender();
    }
}
