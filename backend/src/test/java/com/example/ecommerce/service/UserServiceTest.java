package com.example.ecommerce.service;

import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.enums.Role;
import com.example.ecommerce.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserServiceTest
{
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        user = User.builder()
                .id(1L)
                .firstName("John")
                .lastName("Doe")
                .email("johndoe@example.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();
    }

    @Test
    void loadUserByUsername_ShouldReturnUser_WhenUserExists() {
        when(userRepository.findByEmail(user.getEmail())).thenReturn(Optional.of(user));

        UserDetails result = userService.loadUserByUsername(user.getEmail());

        assertNotNull(result);
        assertEquals(user.getEmail(), result.getUsername());
        verify(userRepository, times(1)).findByEmail(user.getEmail());
    }

    @Test
    void loadUserByUsername_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> userService.loadUserByUsername("missing@example.com"));
        verify(userRepository, times(1)).findByEmail("missing@example.com");
    }

    @Test
    void getUserById_ShouldReturnUser_WhenExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals(user.getId(), result.getId());
        verify(userRepository, times(1)).findById(1L);
    }

    @Test
    void getUserById_ShouldThrow_WhenNotFound() {
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(2L));
        verify(userRepository, times(1)).findById(2L);
    }

    @Test
    void getAllUsers_ShouldReturnListOfUsers(){
        User user2 = User.builder()
                .id(2L)
                .firstName("Jane")
                .lastName("Smith")
                .email("janesmith@example.com")
                .password("password123")
                .role(Role.CUSTOMER)
                .build();

        when(userRepository.findAll()).thenReturn(Arrays.asList(user, user2));

        List<User> result = userService.getAllUsers();

        assertEquals(2, result.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void deleteUserById_ShouldCallRepositoryDelete_WhenUserExists(){
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        userService.deleteUserById(user.getId());
        verify(userRepository, times(1)).delete(user);
    }

    @Test
    void deleteUserById_ShouldThrow_WhenUserNotFound(){
        when(userRepository.findById(2L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> userService.deleteUserById(2L));
        verify(userRepository, never()).delete(any());
    }

    @Test
    void updateUser_ShouldUpdateAndReturnUser_WhenExists() {
        User updatedUser = User.builder()
                .firstName("Updated")
                .lastName("User")
                .email("updated@example.com")
                .password("newpass")
                .build();

        when(userRepository.findById(user.getId())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User result = userService.updateUser(user.getId(), updatedUser);

        assertEquals("Updated", result.getFirstName());
        assertEquals("User", result.getLastName());
        assertEquals("updated@example.com", result.getEmail());
        assertEquals("newpass", result.getPassword());
        verify(userRepository, times(1)).save(user);
    }

    @Test
    void updateUser_ShouldThrow_WhenUserNotFound() {
        User updatedUser = new User();
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(99L, updatedUser));
        verify(userRepository, never()).save(any());
    }

}
