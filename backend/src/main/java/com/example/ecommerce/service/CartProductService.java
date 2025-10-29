package com.example.ecommerce.service;

import com.example.ecommerce.dto.response.CartProductResponseDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.mapper.CartProductMapper;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.CartProduct;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.CartProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartProductService
{
    private final CartProductRepository cartProductRepository;
    private final CartProductMapper cartProductMapper;
    private final ProductService productService;

    public CartProductResponseDto getCartProductByProductId(Long productId){
        Product product = productService.getProductById(productId);
        CartProduct cartProduct = cartProductRepository.findByProduct(product);
        if (cartProduct == null) {
            throw new ResourceNotFoundException("CartProduct not found for product ID: " + productId);
        }

        return cartProductMapper.toDto(cartProduct);
    }

    public List<CartProductResponseDto> getCartProductsInCart(Cart cart){
       List<CartProduct> cartProducts = cartProductRepository.findByCart(cart);

       List<CartProductResponseDto> responseDtos = cartProducts.stream()
               .map(cartProductMapper::toDto)
               .toList();

       return responseDtos;
    }
}
