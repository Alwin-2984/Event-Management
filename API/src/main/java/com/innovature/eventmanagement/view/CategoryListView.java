package com.innovature.eventmanagement.view;

import com.innovature.eventmanagement.entity.Category;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(force = true)
public class CategoryListView {

    private long id;
    private String name;

    public CategoryListView(Category category) {
        this.id = category.getId();
        this.name = category.getName();
    }
}
