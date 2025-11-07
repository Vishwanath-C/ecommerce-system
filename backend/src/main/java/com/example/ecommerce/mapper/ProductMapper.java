package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.request.ProductRequestDto;
import com.example.ecommerce.dto.response.ProductResponseDto;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.service.CategoryService;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper
{
    private CategoryService categoryService;
    public ProductResponseDto toDto(Product product) {
        if (product == null)
            return null;

        return ProductResponseDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .categoryName(product.getCategory() != null ? product.getCategory().getName() : null)
                .unitPrice(product.getUnitPrice())
                .stockQuantity(product.getStockQuantity())
                .build();
    }

    public Product toEntity(ProductRequestDto requestDto, Category category) {
        if (requestDto == null)
            return null;

        return Product.builder()
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .imageUrl(requestDto.getImageUrl())
                .unitPrice(requestDto.getPrice())
                .category(category)
                .stockQuantity(requestDto.getStockQuantity())
                .build();
    }

}
