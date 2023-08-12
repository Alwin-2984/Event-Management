package com.innovature.eventmanagement.entity;

import java.time.LocalDateTime;
import javax.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "status", columnDefinition = "TINYINT")
  private Byte status;

  @Column(name = "created_at")
  @CreationTimestamp
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  @UpdateTimestamp
  private LocalDateTime updatedAt;

  public enum Status {
    ACTIVE((byte) 0), DELETED((byte) 1);

    public final byte value;

    Status(byte value) {
      this.value = value;
    }
  }

  public enum Gender {
    MALE((byte) 0), FEMALE((byte) 1), OTHER((byte) 2);

    public final byte value;

    Gender(byte value) {
      this.value = value;
    }
  }

  public Category(String name) {
    this.name = name;
  }

  public Category() {
  }
}
