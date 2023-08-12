package com.innovature.eventmanagement.repository;

import com.innovature.eventmanagement.entity.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category findByName(String name);

    Category findByNameAndStatus(String name, byte value);

    Page<Category> findByStatusAndNameContainingIgnoreCase(byte value, String search, PageRequest of);

    int countByStatusAndNameContainingIgnoreCase(byte value, String search);

    Category findByIdAndStatus(Long id, byte value);

    Category findByNameAndStatusAndIdNot(String name, byte value, Long id);

}
