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
                .productId(orderProduct.getProductId())
                .productName(orderProduct.getProductName())
                .quantity(orderProduct.getQuantity())
                .unitPrice(orderProduct.getUnitPrice())
                .lineTotal(orderProduct.getLineTotal())
                .build();
    }
}
