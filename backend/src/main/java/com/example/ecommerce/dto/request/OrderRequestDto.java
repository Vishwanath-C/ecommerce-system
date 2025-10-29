package com.example.ecommerce.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderRequestDto
{
    private final Long userId;
    private final Long productId;
}
