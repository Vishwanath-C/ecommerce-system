package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
@Builder
public class ProductResponseDto
{
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal unitPrice;
    private String categoryName;
    private Integer stockQuantity;
}
