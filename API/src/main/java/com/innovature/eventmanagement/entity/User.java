package com.innovature.eventmanagement.entity;

import com.innovature.eventmanagement.enums.Role;
import com.innovature.eventmanagement.json.Json.DateFormat;
import java.time.LocalDateTime;
import java.sql.Date;
import javax.annotation.Nullable;
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
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 255, name = "email", nullable = false, unique = true)
  private String email;

  @Column(name = "password", nullable = false)
  private String password;

  @Column(name = "name", nullable = false)
  private String name;

  @Enumerated(EnumType.ORDINAL)
  @Column(name = "role", columnDefinition = "TINYINT")
  private Role role;
  
  @Column(name = "status", columnDefinition = "TINYINT")
  private Byte status;

  @Nullable
  private Byte gender;

  @DateFormat
  private Date dob;

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

  public enum Gender {
    MALE((byte) 0),
    FEMALE((byte) 1),
    OTHER((byte) 2);

    public final byte value;

    Gender(byte value) {
      this.value = value;
    }
  }

  public User(String email, String password, String name, Byte gender, Date dob) {
    this.email = email;
    this.password = password;
    this.name = name;
    this.status = Status.OTP_NOT_VERIFIED.value;
    this.role = Role.USER;
    this.gender = gender;
    this.dob = dob;
  }

  public User(String email, String name) {
    this.email = email;
    this.name = name;
    this.password = "";
    this.status = Status.ACTIVE.value;
    this.role = Role.USER;
  }

  public User() {
  }
}
