package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;
import java.util.List;

@Getter
@AllArgsConstructor
@ToString
@Builder
public class CartResponseDto
{
    private final Long cartId;
    private final Long userId;
    private final List<CartProductResponseDto> cartProducts;
    private final BigDecimal totalPrice;
}
