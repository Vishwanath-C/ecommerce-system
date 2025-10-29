package com.example.ecommerce.controller;

import com.example.ecommerce.dto.request.CartProductRequestDto;
import com.example.ecommerce.dto.response.CartProductResponseDto;
import com.example.ecommerce.dto.response.CartResponseDto;
import com.example.ecommerce.dto.response.OrderResponseDto;
import com.example.ecommerce.mapper.CartMapper;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.service.CartProductService;
import com.example.ecommerce.service.CartService;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/cart")
@RequiredArgsConstructor
public class CartController
{

    private final CartService cartService;
    private final CartProductService cartProductService;
    private final CartMapper cartMapper;
    private final OrderService orderService;

    @GetMapping
    public CartResponseDto getCartByUserId(@PathVariable(name = "userId") Long userId){
        return cartMapper.toDto(cartService.getCartByUserId(userId));
    }

    @PostMapping("/checkout")
    public OrderResponseDto checkOut(@PathVariable(name = "userId") Long userId){
        System.out.println("checkout ");
        return orderService.checkOut(userId);
    }

    @GetMapping("/products")
    public ResponseEntity<List<CartProductResponseDto>> getAllProductsInCart(@PathVariable Long userId) {
        Cart cart = cartService.getCartByUserId(userId);
        return ResponseEntity.ok(cartProductService.getCartProductsInCart(cart));
    }

    // Add product to cart
    @PostMapping("/products")
    public ResponseEntity<CartResponseDto> addProductToCart(@PathVariable("userId") Long userId,
                                                            @RequestBody CartProductRequestDto request) {
        return ResponseEntity.ok(cartService.addProductToCart(userId, request.getProductId(), request.getQuantity()));
    }


    // Update exact quantity
    @PutMapping("/products/{productId}")
    public ResponseEntity<CartResponseDto> updateProductQuantity(@PathVariable Long userId,
                                                          @PathVariable Long productId,
                                                          @RequestParam int quantity) {
        return ResponseEntity.ok().body(cartService.updateProductQuantity(userId, productId, quantity));
    }

    // Increase quantity by 1
    @PatchMapping("/products/{productId}/increase")
    public ResponseEntity<CartResponseDto> increaseProductQuantity(@PathVariable("userId") Long userId,
                                                                   @PathVariable("productId") Long productId,
                                                                @RequestParam(defaultValue = "1", name = "quantity") int quantity) {
        return ResponseEntity.ok(cartService.addOrIncreaseProductQuantityInCart(userId, productId, quantity));
    }

    // Decrease quantity by 1 (min 1)
    @PatchMapping("/products/{productId}/decrease")
    public ResponseEntity<CartResponseDto> decreaseProductQuantity(@PathVariable("userId") Long userId,
                                                            @PathVariable("productId") Long productId,
                                                            @RequestParam(defaultValue = "1", name = "quantity") int quantity) {
        return ResponseEntity.ok(cartService.decreaseProductQuantityInCart(userId, productId, quantity));
    }




    // Remove product from cart
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<Void> removeProductFromCart(@PathVariable Long userId,
                                                      @PathVariable Long productId) {
        cartService.removeProductFromCart(userId, productId);
        return ResponseEntity.ok().build();
    }
}
