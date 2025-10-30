package com.example.ecommerce.mapper;

import com.example.ecommerce.dto.response.UserResponseDto;
import com.example.ecommerce.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper
{
    public UserResponseDto toDto(User user){
        return UserResponseDto.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
