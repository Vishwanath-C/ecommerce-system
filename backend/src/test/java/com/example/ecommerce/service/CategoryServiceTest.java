package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.CategoryRequestDto;
import com.example.ecommerce.dto.response.CategoryResponseDto;
import com.example.ecommerce.mapper.CategoryMapper;
import com.example.ecommerce.model.Category;
import com.example.ecommerce.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class CategoryServiceTest
{
    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryMapper categoryMapper;

    @InjectMocks
    private CategoryService categoryService;

    @BeforeEach
    void setUp(){
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createCategory_ShouldReturnDto(){
        CategoryRequestDto requestDto = new CategoryRequestDto("Electronics", "Electronics");

        Category category = Category.builder()
                .id(1L)
                .name("Electronics")
                .description("Electronics")
                .build();

        CategoryResponseDto responseDto = new CategoryResponseDto(1L, "Electronics", "Electronics", new ArrayList<>());

        when(categoryMapper.toEntity(requestDto)).thenReturn(category);
        when(categoryRepository.save(category)).thenReturn(category);
        when(categoryMapper.toDto(category)).thenReturn(responseDto);

        CategoryResponseDto result = categoryService.createCategory(requestDto);

        assertNotNull(result);
        assertEquals("Electronics", result.getName());
        verify(categoryRepository, times(1)).save(category);



    }


}
