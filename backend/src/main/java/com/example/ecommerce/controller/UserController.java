package com.example.ecommerce.controller;

import com.example.ecommerce.dto.response.UserResponseDto;
import com.example.ecommerce.model.User;
import com.example.ecommerce.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController
{
    private final UserService userService;

    @GetMapping
    @PreAuthorize(("hasRole('ADMIN)"))
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok().body(userService.getAllUsers());
    }

    @GetMapping("/{userId}")
    @PreAuthorize(("hasRole('ADMIN')"))
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable("userId") Long userId){
        return ResponseEntity.ok().body(userService.getUserDtoById(userId));
    }
}
