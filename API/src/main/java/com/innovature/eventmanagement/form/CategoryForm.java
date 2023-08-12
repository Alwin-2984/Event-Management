package com.innovature.eventmanagement.form;

import com.innovature.eventmanagement.form.validation.Name;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CategoryForm {

  @Name
  private String name;

}
