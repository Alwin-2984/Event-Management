package com.innovature.eventmanagement.security;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class AccessTokenUserDetails implements UserDetails {

    public final int userId;
    public final int roleId;

    private String userRole;

    public AccessTokenUserDetails(int userId,int roleId) {
    this.userId = userId;
    this.roleId=roleId;
    switch (roleId) {
        case 0:
            userRole = "USER";
            break;
        case 1:
            userRole = "ORGANIZER";
            break;
        case 2:
            userRole = "ADMIN";
            break;
        default:
            break;
    }
}


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
    String rolePrefix = "ROLE_";
    List<GrantedAuthority> roles = new ArrayList<>();
    roles.add(new SimpleGrantedAuthority(rolePrefix + userRole));
    return roles;
}

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return null;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
