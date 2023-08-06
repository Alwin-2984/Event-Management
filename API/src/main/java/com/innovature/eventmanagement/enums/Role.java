package com.innovature.eventmanagement.enums;

public enum Role {
  USER((byte) 0),
  ORGANIZER((byte) 1),
  ADMIN((byte) 2);

  public final byte value;

  Role(byte value) {
    this.value = value;
  }
}
