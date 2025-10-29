package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.response.CartProductResponseDto;
import com.example.ecommerce.dto.response.CartResponseDto;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartProduct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class CartMapper
{


    private final CartProductMapper cartProductMapper;

    public CartResponseDto toDto(Cart cart) {
        List<CartProduct> cartProducts = cart.getCartProducts();
        List<CartProductResponseDto> cartProductResponseDtos = cartProducts.stream()
                .map(cartProductMapper::toDto).toList();

        BigDecimal totalPrice = cartProductResponseDtos.stream().map(CartProductResponseDto::getTotalPrice).reduce(BigDecimal.ZERO, BigDecimal::add);

        return CartResponseDto.builder()
                .cartId(cart.getId())
                .cartProducts(cartProductResponseDtos)
                .totalPrice(totalPrice)
                .build();
    }
}
