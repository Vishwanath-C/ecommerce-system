package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.ProductRequestDto;
import com.example.ecommerce.dto.response.ProductResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.ProductMapper;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryService categoryService;
    private final ProductMapper productMapper;

    public ProductResponseDto createProduct(ProductRequestDto requestDto) {
        log.info("Creating new product: {}", requestDto.getName());

        Category category = categoryService.getCategoryById(requestDto.getCategoryId());
        Product product = productMapper.toEntity(requestDto, category);
        Product savedProduct = productRepository.save(product);

        log.debug("Product created successfully with ID: {}", savedProduct.getId());
        return productMapper.toDto(savedProduct);
    }

    public Product getProductById(Long id) {
        log.debug("Fetching product by ID: {}", id);
        return productRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Product with id {} not found!", id);
                    return new ResourceNotFoundException("Product with id " + id + " not found!");
                });
    }

    public List<ProductResponseDto> searchProducts(String query) {
        List<Product> products = productRepository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(query, query);
        List<ProductResponseDto> responseDtos = products.stream().map(productMapper::toDto).toList();
        return responseDtos;
    }


    public ProductResponseDto getProductDtoById(Long id) {
        Product product = getProductById(id);
        log.debug("Fetched product DTO for ID: {}", id);
        return productMapper.toDto(product);
    }

    public List<ProductResponseDto> getAllProducts() {
        log.info("Fetching all products");
        List<ProductResponseDto> products = productRepository.findAll().stream()
                .map(productMapper::toDto)
                .toList();
        log.debug("Total products fetched: {}", products.size());
        return products;
    }

    public List<ProductResponseDto> getProductsByCategory(Long categoryId) {
        log.info("Fetching products for category ID: {}", categoryId);
        List<ProductResponseDto> products = productRepository.findByCategory(categoryService.getCategoryById(categoryId))
                .stream().map(productMapper::toDto)
                .toList();
        log.debug("Fetched {} products for category ID: {}", products.size(), categoryId);
        return products;
    }

    public ProductResponseDto addStockQuantityToProduct(Long productId, int quantityToIncrease) {
        log.info("Adding stock for product ID: {} by {}", productId, quantityToIncrease);

        Product existingProduct = getProductById(productId);
        existingProduct.setStockQuantity(existingProduct.getStockQuantity() + quantityToIncrease);
        Product savedProduct = productRepository.save(existingProduct);

        log.debug("New stock for product ID {}: {}", productId, savedProduct.getStockQuantity());
        return productMapper.toDto(savedProduct);
    }

    @Transactional
    public ProductResponseDto reduceStockQuantityToProduct(Long productId, int quantityToReduce) {
        log.warn("Reducing stock for product ID: {} by {}", productId, quantityToReduce);

        Product product = getProductById(productId);
        int currentStock = product.getStockQuantity();
        int newStock = currentStock - quantityToReduce;

        if (newStock < 0) {
            log.error("Stock cannot be negative for product ID {}. Current: {}, Tried to reduce: {}", productId, currentStock, quantityToReduce);
            throw new IllegalArgumentException("Stock cannot be negative. Current stock: " + currentStock);
        }

        product.setStockQuantity(newStock);
        Product savedProduct = productRepository.save(product);

        log.info("Stock updated for product ID {}. New stock: {}", productId, newStock);
        return productMapper.toDto(savedProduct);
    }

    public ProductResponseDto updateProduct(ProductRequestDto newProductRequest, Long productId) {
        log.info("Updating product ID: {}", productId);

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.error("Product not found with ID {}", productId);
                    return new ResourceNotFoundException("Product not found with id " + productId);
                });

        existingProduct.setName(newProductRequest.getName());
        existingProduct.setCategory(categoryService.getCategoryById(newProductRequest.getCategoryId()));
        existingProduct.setDescription(newProductRequest.getDescription());
        existingProduct.setUnitPrice(newProductRequest.getPrice());
        existingProduct.setStockQuantity(newProductRequest.getStockQuantity());

        Product savedProduct = productRepository.save(existingProduct);

        log.debug("Product ID {} updated successfully", productId);
        return productMapper.toDto(savedProduct);
    }

    public void deleteProduct(Long productId) {
        log.warn("Deleting product with ID: {}", productId);

        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> {
                    log.error("Product not found with ID {}", productId);
                    return new ResourceNotFoundException("Product not found with id " + productId);
                });

        productRepository.delete(existingProduct);
        log.info("Product with ID {} deleted successfully", productId);
    }
}
