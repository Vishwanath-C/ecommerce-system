package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.response.CartProductResponseDto;
import com.example.ecommerce.model.CartProduct;
import org.springframework.stereotype.Component;

@Component
public class CartProductMapper
{
    public CartProductResponseDto toDto(CartProduct cartProduct){
        return CartProductResponseDto.builder()
                .productId(cartProduct.getProduct().getId())
                .productName(cartProduct.getProduct().getName())
                .quantity(cartProduct.getQuantity())
                .totalPrice(cartProduct.getTotalPrice())
                .build();
    }
}
