package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.CartProductResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.CartProductMapper;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartProduct;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CartProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CartProductServiceTest
{
    @Mock
    private CartProductRepository cartProductRepository;

    @Mock
    private ProductService productService;

    @Mock
    private CartProductMapper cartProductMapper;

    @InjectMocks
    private CartProductService cartProductService;

    private Product product;
    private CartProduct cartProduct;
    private CartProductResponseDto responseDto;

    @BeforeEach
    void setUp(){

        MockitoAnnotations.openMocks(this);

        product = Product.builder()
                .id(1L)
                .name("iPhone 17")
                .category(new Category(1L, "Electronics", "Electronics", new ArrayList<>()))
                .unitPrice(BigDecimal.valueOf(89999))
                .stockQuantity(10)
                .build();

        cartProduct = CartProduct.builder()
                .id(1L)
                .product(product)
                .cart(new Cart())
                .quantity(2)
                .build();


        responseDto = CartProductResponseDto.builder()
                .productId(cartProduct.getProduct().getId())
                .productName(cartProduct.getProduct().getName())
                .quantity(cartProduct.getQuantity())
                .totalPrice(cartProduct.getTotalPrice())
                .build();

    }

    @Test
    void getCartProductByProductId_ShouldReturnCartProductResponseDtoWhenExists(){
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartProductRepository.findByProduct(product)).thenReturn(cartProduct);
        when(cartProductMapper.toDto(cartProduct)).thenReturn(responseDto);

        CartProductResponseDto result = cartProductService.getCartProductByProductId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getProductId());
        assertEquals("iPhone 17", result.getProductName());

        verify(productService, timeout(1)).getProductById(1L);
        verify(cartProductRepository, times(1)).findByProduct(product);
    }

    @Test
    void getCartProductByProductId_ShouldThrow_WhenNotFound() {
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartProductRepository.findByProduct(product)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class,
                () -> cartProductService.getCartProductByProductId(1L));

        verify(productService).getProductById(1L);
        verify(cartProductRepository).findByProduct(product);
    }
}
