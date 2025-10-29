package com.example.ecommerce.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryRequestDto
{
    private String name;
    private String description;
}
