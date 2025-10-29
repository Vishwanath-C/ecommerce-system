package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.response.OrderProductResponseDto;
import com.example.ecommerce.model.OrderProduct;
import org.springframework.stereotype.Component;

@Component
public class OrderProductMapper
{

    public OrderProductResponseDto toDto(OrderProduct orderProduct){
        return OrderProductResponseDto.builder()
                .id(orderProduct.getId())
                .productId(orderProduct.getProduct().getId())
                .productName(orderProduct.getProduct().getName())
                .quantity(orderProduct.getQuantity())
                .unitPrice(orderProduct.getUnitPrice())
                .lineTotal(orderProduct.getLineTotal())
                .build();
    }
}
