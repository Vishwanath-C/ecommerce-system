package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.CategoryRequestDto;
import com.example.ecommerce.dto.response.CategoryResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.CategoryMapper;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    /**
     * Create a new category
     */
    public CategoryResponseDto createCategory(CategoryRequestDto requestDto) {
        log.info("Creating new category: {}", requestDto.getName());
        Category savedCategory = categoryRepository.save(categoryMapper.toEntity(requestDto));
        log.debug("Category created successfully with ID: {}", savedCategory.getId());
        return categoryMapper.toDto(savedCategory);
    }

    /**
     * Get Category entity by ID
     */
    public Category getCategoryById(Long id) {
        log.debug("Fetching Category entity by ID: {}", id);
        return categoryRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Category with ID {} not found", id);
                    return new ResourceNotFoundException("Category with id " + id + " not found!");
                });
    }

    /**
     * Get Category DTO by ID
     */
    public CategoryResponseDto getCategoryDtoById(Long id) {
        log.info("Fetching Category DTO by ID: {}", id);
        Category category = getCategoryById(id);
        return categoryMapper.toDto(category);
    }

    /**
     * Get all categories
     */
    public List<CategoryResponseDto> getAllCategories() {
        log.info("Fetching all categories");
        List<CategoryResponseDto> categories = categoryRepository.findAll()
                .stream()
                .map(categoryMapper::toDto)
                .toList();
        log.debug("Fetched {} categories", categories.size());
        return categories;
    }

    /**
     * Update existing category
     */
    @Transactional
    public CategoryResponseDto updateCategory(Category newCategory, Long id) {
        log.info("Updating category with ID: {}", id);
        Category existingCategory = getCategoryById(id);

        existingCategory.setName(newCategory.getName());
        existingCategory.setDescription(newCategory.getDescription());

        Category savedCategory = categoryRepository.save(existingCategory);
        log.debug("Category with ID {} updated successfully", savedCategory.getId());

        return categoryMapper.toDto(savedCategory);
    }

    /**
     * Delete category by ID
     */
    @Transactional
    public void deleteCategory(Long id) {
        log.warn("Deleting category with ID: {}", id);
        Category existingCategory = getCategoryById(id);
        categoryRepository.delete(existingCategory);
        log.info("Category with ID {} deleted successfully", id);
    }
}
