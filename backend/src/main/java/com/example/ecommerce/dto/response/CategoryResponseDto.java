package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class CategoryResponseDto
{
    private final Long id;
    private final String name;
    private String description;
    private List<String> productNames;
}
