package com.innovature.eventmanagement.view;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class CountView {

  private long count;

  public CountView(long count) {
    this.count = count;
  }
}
