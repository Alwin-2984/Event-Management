package com.innovature.eventmanagement.entity;

import java.time.LocalTime;
import java.util.Date;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "otp")
public class Otp {

  public enum Status {
    ACTIVE((byte) 0),
    INACTIVE((byte) 1);

    public final byte value;

    Status(byte value) {
      this.value = value;
    }
  }

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Integer id;

  @Column(unique = true)
  private String email;

  private String otp;

  private LocalTime expiry;

  private byte status;

  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt;
}
