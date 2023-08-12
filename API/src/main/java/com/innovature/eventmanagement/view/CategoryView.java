package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class CategoryView {

    private final long id;
    private final String name;
    private final byte status;

    public CategoryView(Category category) {
        this.id = category.getId();
        this.name = category.getName();
        this.status = category.getStatus();

    }
}
