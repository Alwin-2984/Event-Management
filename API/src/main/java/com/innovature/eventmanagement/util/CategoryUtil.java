package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.entity.Category;
import com.innovature.eventmanagement.exception.BadRequestException;
import com.innovature.eventmanagement.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class CategoryUtil {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private LanguageUtil languageUtil;

    /**
     * Checks if a category with the given name already exists in an ACTIVE state.
     * If a duplicate category is found, a BadRequestException is thrown.
     *
     * @param name The name of the category to check for duplication.
     * @return Null if no duplicate category is found, otherwise throws a
     *         BadRequestException.
     * @throws BadRequestException if a category with the same name is found.
     */
    public Category checkDuplication(String name) {
        // Check if a category with the given name already exists and is active
        Category category = categoryRepository.findByNameAndStatus(name, Category.Status.ACTIVE.value);

        if (category != null) {
            // If a duplicate category is found, throw a BadRequestException
            throw new BadRequestException(languageUtil.getTranslatedText("category.duplicate", null, "en"));
        } else {
            // No duplicate category found, return null
            return null;
        }
    }
}
