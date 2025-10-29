package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.request.CategoryRequestDto;
import com.example.ecommerce.dto.response.CategoryResponseDto;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.model.Product;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
public class CategoryMapper
{


    public Category toEntity(CategoryRequestDto requestDto){
        return Category.builder()
                .name(requestDto.getName())
                .description(requestDto.getDescription())
                .products(new ArrayList<>())
                .build();
    }

    public CategoryResponseDto toDto(Category category){
               return CategoryResponseDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .productNames(category.getProducts().stream().map(Product::getName).toList())
                .build();
    }
}
