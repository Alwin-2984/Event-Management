package com.innovature.eventmanagement.view;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class countView {

  private long count;

  public countView(long count) {
    this.count = count;
  }
}
