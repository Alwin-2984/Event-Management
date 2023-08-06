package com.innovature.eventmanagement.entity;

import com.innovature.eventmanagement.enums.Role;
import java.time.LocalDateTime;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
public class Organizer {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 255,name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "name", nullable = false)
  private String name;

  @Enumerated(EnumType.ORDINAL)
  @Column(name = "role", columnDefinition = "TINYINT")
  private Role role;

  private byte status;

  @Column(name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public enum Status {
    ACTIVE((byte) 0),
    INACTIVE((byte) 1),
    DELETE((byte) 2),
    OTP_NOT_VERIFIED((byte) 3);

    public final byte value;

    Status(byte value) {
      this.value = value;
    }
  }

  public Organizer(String email, String password, String name) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.status = Status.OTP_NOT_VERIFIED.value;
    this.role = Role.ORGANIZER;
  }

  public Organizer() {}


}
