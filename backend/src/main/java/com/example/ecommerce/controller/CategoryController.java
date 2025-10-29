package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.CategoryRequestDto;
import com.example.ecommerce.dto.response.CategoryResponseDto;
import com.example.ecommerce.dto.response.ProductResponseDto;
import com.example.ecommerce.service.CategoryService;
import com.example.ecommerce.service.ProductService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Slf4j
public class CategoryController {

    private final CategoryService categoryService;
    private final ProductService productService;

    /**
     * Create a new category
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CategoryResponseDto> createCategory(@Valid @RequestBody CategoryRequestDto categoryRequestDto) {
        log.info("Creating new category: {}", categoryRequestDto.getName());
        CategoryResponseDto createdCategory = categoryService.createCategory(categoryRequestDto);
        log.debug("Category created successfully with ID: {}", createdCategory.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
    }

    /**
     * Get category by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDto> getCategoryById(@PathVariable Long id) {
        log.info("Fetching category by ID: {}", id);
        CategoryResponseDto category = categoryService.getCategoryDtoById(id);
        log.debug("Fetched category details: {}", category);
        return ResponseEntity.ok(category);
    }

    /**
     * Get all categories
     */
    @GetMapping
    public ResponseEntity<List<CategoryResponseDto>> getAllCategories() {
        log.info("Fetching all categories");
        List<CategoryResponseDto> categories = categoryService.getAllCategories();
        log.debug("Total categories fetched: {}", categories.size());
        return ResponseEntity.ok(categories);
    }

    /**
     * Get all products for a given category
     */
    @GetMapping("/{categoryId}/products")
    public ResponseEntity<List<ProductResponseDto>> getProductsByCategory(@PathVariable(name = "categoryId") Long categoryId) {
        log.info("Fetching products for category ID: {}", categoryId);
        List<ProductResponseDto> products = productService.getProductsByCategory(categoryId);
        log.debug("Fetched {} products for category ID: {}", products.size(), categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * Delete category by ID
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        log.warn("Deleting category with ID: {}", id);
        categoryService.deleteCategory(id);
        log.info("Category with ID {} deleted successfully", id);
        return ResponseEntity.ok().build();
    }
}
