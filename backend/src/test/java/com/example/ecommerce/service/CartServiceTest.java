package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.CartResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.CartMapper;
import com.example.ecommerce.model.*;
import com.example.ecommerce.repository.CartRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CartServiceTest {

    @Mock
    private CartRepository cartRepository;

    @Mock
    private UserService userService;

    @Mock
    private ProductService productService;

    @Mock
    private CartMapper cartMapper;

    @InjectMocks
    private CartService cartService;

    private User user;
    private Product product;
    private Cart cart;
    private CartResponseDto responseDto;
    private CartProduct cartProduct;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("john@example.com")
                .build();

        product = Product.builder()
                .id(1L)
                .name("iPhone 17")
                .unitPrice(BigDecimal.valueOf(89999))
                .stockQuantity(10)
                .build();

        cartProduct = CartProduct.builder()
                .id(1L)
                .product(product)
                .quantity(2)
                .build();

        cart = Cart.builder()
                .id(1L)
                .user(user)
                .cartProducts(new ArrayList<>())
                .build();
        cart.getCartProducts().add(cartProduct);

        responseDto = new CartResponseDto(1L, user.getId(), new ArrayList<>(), product.getUnitPrice());
    }

    // === getCartByUserId ===
    @Test
    void getCartByUserId_ShouldReturnExistingCart() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        Cart result = cartService.getCartByUserId(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(cartRepository, never()).save(any());
    }

    @Test
    void getCartByUserId_ShouldCreateNewCartIfNotExists() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.empty());
        when(cartRepository.save(any(Cart.class))).thenReturn(cart);

        Cart result = cartService.getCartByUserId(1L);

        assertNotNull(result);
        verify(cartRepository, times(1)).save(any(Cart.class));
    }

    // === updateProductQuantity ===
    @Test
    void updateProductQuantity_ShouldUpdateSuccessfully() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.updateProductQuantity(1L, 1L, 5);

        assertNotNull(result);
        assertEquals(5, cartProduct.getQuantity());
        verify(cartRepository).save(cart);
    }

    @Test
    void updateProductQuantity_ShouldThrow_WhenInvalidQuantity() {
        assertThrows(IllegalArgumentException.class, () ->
                cartService.updateProductQuantity(1L, 1L, 0));
    }

    // === addProductToCart ===
    @Test
    void addProductToCart_ShouldAddNewProduct() {
        cart.getCartProducts().clear(); // no products initially
        when(userService.getUserById(1L)).thenReturn(user);
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.addProductToCart(1L, 1L, 3);

        assertNotNull(result);
        assertEquals(1, cart.getCartProducts().size());
        assertEquals(3, cart.getCartProducts().get(0).getQuantity());
        verify(cartRepository).save(cart);
    }

    @Test
    void addProductToCart_ShouldIncreaseExistingQuantity() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.addProductToCart(1L, 1L, 2);

        assertEquals(4, cartProduct.getQuantity());
        verify(cartRepository).save(cart);
    }

    @Test
    void addProductToCart_ShouldThrow_WhenQuantityTooHigh() {
        cart.getCartProducts().clear();
        when(userService.getUserById(1L)).thenReturn(user);
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        assertThrows(IllegalArgumentException.class, () -> cartService.addProductToCart(1L, 1L, 20));
    }

    // === addOrIncreaseProductQuantityInCart ===
    @Test
    void addOrIncreaseProductQuantityInCart_ShouldAddNew_WhenNotExists() {
        cart.getCartProducts().clear();
        when(userService.getUserById(1L)).thenReturn(user);
        when(productService.getProductById(1L)).thenReturn(product);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.addOrIncreaseProductQuantityInCart(1L, 1L, 2);

        assertEquals(1, cart.getCartProducts().size());
        verify(cartRepository).save(cart);
    }

    @Test
    void addOrIncreaseProductQuantityInCart_ShouldIncrease_WhenExists() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.addOrIncreaseProductQuantityInCart(1L, 1L, 2);

        assertEquals(4, cartProduct.getQuantity());
    }

    @Test
    void addOrIncreaseProductQuantityInCart_ShouldThrow_WhenExceedsStock() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        assertThrows(IllegalArgumentException.class,
                () -> cartService.addOrIncreaseProductQuantityInCart(1L, 1L, 100));
    }

    // === decreaseProductQuantityInCart ===
    @Test
    void decreaseProductQuantityInCart_ShouldDecreaseQuantity() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.decreaseProductQuantityInCart(1L, 1L, 1);

        assertEquals(1, cartProduct.getQuantity());
    }

    @Test
    void decreaseProductQuantityInCart_ShouldRemove_WhenQuantityBelow1() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));
        when(cartRepository.save(cart)).thenReturn(cart);
        when(cartMapper.toDto(cart)).thenReturn(responseDto);

        CartResponseDto result = cartService.decreaseProductQuantityInCart(1L, 1L, 2);

        assertTrue(cart.getCartProducts().isEmpty());
    }

    @Test
    void decreaseProductQuantityInCart_ShouldThrow_WhenInvalidQuantity() {
        assertThrows(IllegalArgumentException.class, () ->
                cartService.decreaseProductQuantityInCart(1L, 1L, 0));
    }

    // === removeProductFromCart ===
    @Test
    void removeProductFromCart_ShouldRemoveSuccessfully() {
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        cartService.removeProductFromCart(1L, 1L);

        assertTrue(cart.getCartProducts().isEmpty());
        verify(cartRepository).save(cart);
    }

    @Test
    void removeProductFromCart_ShouldThrow_WhenProductNotFound() {
        cart.getCartProducts().clear();
        when(userService.getUserById(1L)).thenReturn(user);
        when(cartRepository.findByUser(user)).thenReturn(Optional.of(cart));

        assertThrows(ResourceNotFoundException.class, () ->
                cartService.removeProductFromCart(1L, 99L));
    }
}
