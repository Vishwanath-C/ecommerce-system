package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.ProductRequestDto;
import com.example.ecommerce.dto.response.ProductResponseDto;
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
@RequestMapping("/products")
@RequiredArgsConstructor
@Slf4j
public class ProductController {

    private final ProductService productService;

    /**
     * Create a new product
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> createProduct(@Valid @RequestBody ProductRequestDto requestDto) {
        System.out.println("In create product " + requestDto);
        log.info("Creating new product: {}", requestDto);
        ProductResponseDto createdProduct = productService.createProduct(requestDto);
        log.debug("Product created successfully with ID: {}", createdProduct.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    /**
     * Get product details by ID
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductResponseDto> getProductById(@PathVariable Long productId) {
        log.info("Fetching product with ID: {}", productId);
        return ResponseEntity.ok(productService.getProductDtoById(productId));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProductResponseDto>> searchProducts(@RequestParam("query") String query) {
        List<ProductResponseDto> products = productService.searchProducts(query);
        return ResponseEntity.ok(products);
    }

    /**
     * Get all products
     */
    @GetMapping
    public ResponseEntity<List<ProductResponseDto>> getAllProducts() {
        log.info("Fetching all products");
        List<ProductResponseDto> products = productService.getAllProducts();
        log.debug("Total products fetched: {}", products.size());
        return ResponseEntity.ok(products);
    }

    /**
     * Update an existing product
     */
    @PutMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponseDto> updateProduct(
            @PathVariable(name = "productId") Long productId,
            @Valid @RequestBody ProductRequestDto newProduct) {
        System.out.println("In update");
        log.info("Updating product with ID: {}", productId);
        ProductResponseDto updatedProduct = productService.updateProduct(newProduct, productId);
        log.debug("Product updated successfully: {}", updatedProduct);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * Delete a product by ID
     */
    @DeleteMapping("/{productId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long productId) {
        log.info("Deleting product with ID: {}", productId);
        productService.deleteProduct(productId);
        log.debug("Product with ID {} deleted successfully", productId);
        return ResponseEntity.noContent().build();
    }
}
