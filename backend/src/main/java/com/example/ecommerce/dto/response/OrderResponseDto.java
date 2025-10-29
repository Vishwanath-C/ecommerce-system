package com.example.ecommerce.dto.response;

import com.example.ecommerce.model.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class OrderResponseDto
{
    private final Long orderId;
    private final Long userId;
    private final List<OrderProductResponseDto> orderProducts;
    private final BigDecimal totalPrice;
    private final LocalDateTime orderDate;
    private final OrderStatus orderStatus;
}
