package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.OrderResponseDto;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/{userId}/orders")
@RequiredArgsConstructor
public class UserOrderController
{
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrdersByUserId(@PathVariable Long userId){
        return ResponseEntity.ok().body(orderService.getOrdersByUserId(userId));
    }

    @GetMapping("/{orderID}")
    public ResponseEntity<OrderResponseDto> getOrder(@PathVariable Long userId, @PathVariable Long orderID){
        return ResponseEntity.ok().body(orderService.getOrderDtoById(orderID));
    }
}
