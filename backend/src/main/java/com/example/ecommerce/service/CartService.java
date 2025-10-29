package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.CartResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.CartMapper;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartProduct;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserService userService;
    private final ProductService productService;
    private final CartMapper cartMapper;

    // ✅ Get or create a user's cart
    public Cart getCartByUserId(Long userId) {
        User user = userService.getUserById(userId);
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(
                        Cart.builder()
                                .user(user)
                                .cartProducts(new ArrayList<>())
                                .build()
                ));
    }

    // ✅ Set exact product quantity (PUT - idempotent)
    @Transactional
    public CartResponseDto updateProductQuantity(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than zero");
        }

        Cart cart = getCartByUserId(userId);
        CartProduct cartProduct = findCartProduct(cart, productId);

        cartProduct.setQuantity(quantity);
        return cartMapper.toDto(cartRepository.save(cart));
    }

    // ✅ Add new product or increase quantity (POST or PATCH)
    @Transactional
    public CartResponseDto addProductToCart(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Cart cart = getCartByUserId(userId);
        Product product = productService.getProductById(productId);

        CartProduct existing = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
        } else {
            if (quantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Requested quantity exceeds available stock");
            }

            CartProduct newCartProduct = CartProduct.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();

            cart.getCartProducts().add(newCartProduct);
        }

        Cart savedCart = cartRepository.save(cart);
        System.out.println("Saved cart " + cartMapper.toDto(savedCart));

        return cartMapper.toDto(savedCart);
    }

    // ✅ Increase quantity (PATCH - non-idempotent)
    @Transactional
    public CartResponseDto addOrIncreaseProductQuantityInCart(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Cart cart = getCartByUserId(userId);
        CartProduct cartProduct = cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        Product product = (cartProduct == null) ? productService.getProductById(productId) : cartProduct.getProduct();

        if (cartProduct == null) {
            if (quantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Requested quantity exceeds available stock");
            }

            CartProduct newCartProduct = CartProduct.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(quantity)
                    .build();

            cart.getCartProducts().add(newCartProduct);
        } else {
            int newQuantity = cartProduct.getQuantity() + quantity;
            if (newQuantity > product.getStockQuantity()) {
                throw new IllegalArgumentException("Not enough stock available");
            }
            cartProduct.setQuantity(newQuantity);
        }

        CartResponseDto responseDto = cartMapper.toDto(cartRepository.save(cart));

        System.out.println("Cart Response increase : " + responseDto);

        return responseDto;
    }

    // ✅ Decrease quantity (PATCH - non-idempotent)
    @Transactional
    public CartResponseDto decreaseProductQuantityInCart(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to decrease must be positive");
        }

        Cart cart = getCartByUserId(userId);
        CartProduct cartProduct = findCartProduct(cart, productId);

        int newQuantity = cartProduct.getQuantity() - quantity;

        if (newQuantity < 1) {
            cart.getCartProducts().remove(cartProduct);
        } else {
            cartProduct.setQuantity(newQuantity);
        }

        CartResponseDto responseDto = cartMapper.toDto(cartRepository.save(cart));

        System.out.println("Cart Response decrease : " + responseDto);

        return responseDto;
    }

    // ✅ Remove product completely (DELETE)
    @Transactional
    public void removeProductFromCart(Long userId, Long productId) {
        Cart cart = getCartByUserId(userId);
        CartProduct cartProduct = findCartProduct(cart, productId);

        cart.getCartProducts().remove(cartProduct);
        cartRepository.save(cart);
    }

    // ✅ Helper method
    private CartProduct findCartProduct(Cart cart, Long productId) {
        return cart.getCartProducts().stream()
                .filter(cp -> cp.getProduct().getId().equals(productId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in cart"));
    }
}
