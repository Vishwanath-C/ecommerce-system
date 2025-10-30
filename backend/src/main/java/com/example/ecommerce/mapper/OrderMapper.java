package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.response.OrderProductResponseDto;
import com.example.ecommerce.dto.response.OrderResponseDto;
import com.example.ecommerce.model.Order;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class OrderMapper
{

    public OrderResponseDto toDto(Order order){
        List<OrderProductResponseDto> orderProductResponseDtos = order.getOrderProducts().stream()
                .map(
                        orderProduct -> OrderProductResponseDto.builder()
                                .productId(orderProduct.getOrder().getId())
                                .productName(orderProduct.getProductName())
                                .unitPrice(orderProduct.getUnitPrice())
                                .quantity(orderProduct.getQuantity())
                                .build()
                ).toList();

        return OrderResponseDto.builder()
                .orderId(order.getId())
                .userId(order.getUser().getId())
                .orderProducts(orderProductResponseDtos)
                .totalPrice(order.getTotalPrice())
                .orderDate(order.getOrderDate())
                .orderStatus(order.getOrderStatus())
                .build();
    }


}
