package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@ToString
@Builder
public class CartProductResponseDto
{
    private final Long productId;
    private final String productName;
    private final int quantity;
    private final BigDecimal totalPrice;
}
