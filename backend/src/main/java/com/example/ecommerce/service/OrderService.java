package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.OrderResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.OrderMapper;
import com.example.ecommerce.model.*;
import com.example.ecommerce.model.enums.OrderStatus;
import com.example.ecommerce.repository.CartProductRepository;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.OrderProductRepository;
import com.example.ecommerce.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderProductRepository orderProductRepository;
    private final CartProductRepository cartProductRepository;
    private final UserService userService;
    private final CartService cartService;
    private final CartRepository cartRepository;
    private final OrderMapper orderMapper;
    private final ProductService productService;

    public Order getOrderById(Long id) {
        log.debug("Fetching order by ID: {}", id);
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order with id " + id + " not found!"));
    }

    public OrderResponseDto getOrderDtoById(Long id) {
        log.info("Fetching order DTO for ID: {}", id);
        return orderMapper.toDto(getOrderById(id));
    }

    public List<OrderResponseDto> getOrdersByUserId(Long userId) {
        log.info("Fetching orders for user ID: {}", userId);
        return orderRepository.findByUser(userService.getUserById(userId))
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    public List<OrderResponseDto> getAllOrders() {
        log.info("Fetching all orders");
        return orderRepository.findAll()
                .stream()
                .map(orderMapper::toDto)
                .toList();
    }

    /**
     * Simple "Buy Now" — creates a new order with a single product.
     */
    @Transactional
    public OrderResponseDto buyNow(Long userId, Long productId) {
        log.info("User {} initiated Buy Now for product {}", userId, productId);

        Product product = productService.getProductById(productId);

        if (product.getStockQuantity() <= 0) {
            throw new IllegalStateException("Product out of stock");
        }

        // Reduce stock
        product.setStockQuantity(product.getStockQuantity() - 1);

        Order order = Order.builder()
                .user(userService.getUserById(userId))
                .orderStatus(OrderStatus.PENDING)
                .totalPrice(product.getUnitPrice())
                .build();

        OrderProduct orderProduct = OrderProduct.builder()
                .order(order)
                .productId(product.getId())
                .productName(product.getName())
                .productImageUrl(product.getImageUrl())
                .unitPrice(product.getUnitPrice())
                .quantity(1)
                .build();

        orderProductRepository.save(orderProduct);
        order.getOrderProducts().add(orderProduct);
        Order savedOrder = orderRepository.save(order);

        log.info("Buy Now order {} created successfully for user {}", savedOrder.getId(), userId);
        return orderMapper.toDto(savedOrder);
    }

    /**
     * Checkout — converts user's cart into an order.
     */
    @Transactional
    public OrderResponseDto checkOut(Long userId) {
        System.out.println("IN checkout");
        log.info("User {} attempting to checkout", userId);

        Cart cart = cartService.getCartByUserId(userId);

        if (cart.getCartProducts().isEmpty()) {
            log.warn("Checkout failed for user {} — cart is empty", userId);
            throw new IllegalStateException("Cart is empty!");
        }

        Order order = Order.builder()
                .user(userService.getUserById(userId))
                .orderStatus(OrderStatus.PENDING)
                .build();

        orderRepository.save(order);

        BigDecimal totalPrice = BigDecimal.ZERO;

        for (CartProduct cartProduct : cart.getCartProducts()) {
            Product product = cartProduct.getProduct();

            if (product.getStockQuantity() < cartProduct.getQuantity()) {
                throw new IllegalStateException("Not enough stock for product: " + product.getName());
            }

            // Reduce stock
            product.setStockQuantity(product.getStockQuantity() - cartProduct.getQuantity());

            BigDecimal itemTotal = product.getUnitPrice()
                    .multiply(BigDecimal.valueOf(cartProduct.getQuantity()));

            totalPrice = totalPrice.add(itemTotal);

            OrderProduct orderProduct = OrderProduct.builder()
                    .order(order)
                    .productId(product.getId())
                    .productName(product.getName())
                    .productImageUrl(product.getImageUrl())
                    .unitPrice(product.getUnitPrice())
                    .quantity(cartProduct.getQuantity())
                    .build();

            orderProductRepository.save(orderProduct);
        }

        order.setTotalPrice(totalPrice);
        Order savedOrder = orderRepository.save(order);

        cartProductRepository.deleteAll(cart.getCartProducts());
        cart.getCartProducts().clear();


        log.info("Checkout completed successfully for user {} — total {}", userId, totalPrice);
        return orderMapper.toDto(savedOrder);
    }
}
