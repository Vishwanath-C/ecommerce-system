package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.OrderResponseDto;
import com.example.ecommerce.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class AdminOrderController
{
    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponseDto>> getAllOrders(){
        return ResponseEntity.ok().body(orderService.getAllOrders());
    }

    @GetMapping("/{orderId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderResponseDto> getOrderById(@PathVariable Long orderId){
        return ResponseEntity.ok().body(orderService.getOrderDtoById(orderId));
    }

}
