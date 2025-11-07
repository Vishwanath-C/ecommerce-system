package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.ProductRequestDto;
import com.example.ecommerce.dto.response.ProductResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.ProductMapper;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private ProductRequestDto requestDto;
    private Product product;
    private ProductResponseDto responseDto;
    private Category category;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        category = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Electronics category")
                .build();

        requestDto = new ProductRequestDto(
                "iPhone 17",
                "Apple phone",
                "https://istyle.cz/cdn/shop/files/iphone_pro_oranzovy_1_d13d0b99-ca05-4ab5-9b06-c399fe6315da.jpg?v=1757506545",
                BigDecimal.valueOf(89999),
                1L,
                10
        );

        product = Product.builder()
                .id(1L)
                .name("iPhone 17")
                .description("Apple phone")
                .unitPrice(BigDecimal.valueOf(89999))
                .stockQuantity(10)
                .category(category)
                .build();

        responseDto = new ProductResponseDto(
                1L,
                "iPhone 17",
                "Apple phone",
                "",
                BigDecimal.valueOf(89999),
                "Electronics",
                10
        );
    }

    @Test
    void createProduct_ShouldReturnProductResponse() {
        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(productMapper.toEntity(requestDto, category)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(responseDto);

        ProductResponseDto result = productService.createProduct(requestDto);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(0, result.getUnitPrice().compareTo(BigDecimal.valueOf(89999)));
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void getProductById_ShouldReturnProduct_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        Product result = productService.getProductById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getProductById_ShouldThrow_WhenNotFound() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getProductById(1L));
        verify(productRepository, times(1)).findById(1L);
    }

    @Test
    void getAllProducts_ShouldReturnListOfProducts() {
        Product product2 = Product.builder()
                .id(2L)
                .name("Macbook Pro")
                .description("Apple Laptop")
                .unitPrice(BigDecimal.valueOf(129999))
                .stockQuantity(5)
                .category(category)
                .build();

        ProductResponseDto responseDto2 = new ProductResponseDto(
                2L, "Macbook Pro", "Apple Laptop","",
                BigDecimal.valueOf(129999), "Electronics", 5
        );

        when(productRepository.findAll()).thenReturn(Arrays.asList(product, product2));
        when(productMapper.toDto(product)).thenReturn(responseDto);
        when(productMapper.toDto(product2)).thenReturn(responseDto2);

        List<ProductResponseDto> result = productService.getAllProducts();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).getId());
        assertEquals(2L, result.get(1).getId());
        verify(productRepository, times(1)).findAll();
        verify(productMapper, times(1)).toDto(product);
        verify(productMapper, times(1)).toDto(product2);
    }

    @Test
    void addStockQuantityToProduct_ShouldIncreaseStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(responseDto);

        ProductResponseDto result = productService.addStockQuantityToProduct(1L, 5);

        assertEquals(15, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void reduceStockQuantityToProduct_ShouldReduceStock() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(responseDto);

        ProductResponseDto result = productService.reduceStockQuantityToProduct(1L, 5);

        assertEquals(5, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void reduceStockQuantityToProduct_ShouldThrow_WhenStockNegative() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        assertThrows(IllegalArgumentException.class, () -> productService.reduceStockQuantityToProduct(1L, 20));
        verify(productRepository, never()).save(product);
    }

    @Test
    void updateProduct_ShouldUpdateAndReturn() {
        ProductRequestDto updatedDto = new ProductRequestDto(
                "iPhone 17 Pro",
                "Apple phone upgraded",
                "https://istyle.cz/cdn/shop/files/iphone_pro_oranzovy_1_d13d0b99-ca05-4ab5-9b06-c399fe6315da.jpg?v=1757506545",
                BigDecimal.valueOf(99999),
                1L,
                15
        );

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(categoryService.getCategoryById(1L)).thenReturn(category);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDto(product)).thenReturn(responseDto);

        ProductResponseDto result = productService.updateProduct(updatedDto, 1L);

        assertEquals("iPhone 17 Pro", product.getName());
        assertEquals(15, product.getStockQuantity());
        verify(productRepository, times(1)).save(product);
    }

//    @Test
//    void updateProduct_ShouldThrow_WhenProductNotFound() {
////        ProductRequestDto updatedDto = new ProductRequestDto();
//        when(productRepository.findById(99L)).thenReturn(Optional.empty());
//
//        assertThrows(ResourceNotFoundException.class, () -> productService.updateProduct(updatedDto, 99L));
//        verify(productRepository, never()).save(any());
//    }

    @Test
    void deleteProduct_ShouldCallRepositoryDelete_WhenExists() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        productService.deleteProduct(1L);

        verify(productRepository, times(1)).delete(product);
    }

    @Test
    void deleteProduct_ShouldThrow_WhenNotFound() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.deleteProduct(99L));
        verify(productRepository, never()).delete(any());
    }
}
