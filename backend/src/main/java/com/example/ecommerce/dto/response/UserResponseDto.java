package com.example.ecommerce.dto.response;

import com.example.ecommerce.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class UserResponseDto
{
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
}
