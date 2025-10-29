//package com.example.ecommerce.controller;
//
//import com.example.ecommerce.model.User;
//import com.example.ecommerce.model.enums.Role;
//import com.example.ecommerce.service.UserService;
//import org.junit.jupiter.api.BeforeEach;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
//import org.springframework.http.MediaType;
//import org.springframework.security.test.context.support.WithMockUser;
//import org.springframework.test.context.bean.override.mockito.MockitoBean;
//import org.springframework.test.web.servlet.MockMvc;
//
//import java.util.Arrays;
//import java.util.List;
//
//import static org.hamcrest.Matchers.is;
//import static org.mockito.ArgumentMatchers.anyLong;
//import static org.mockito.Mockito.when;
//import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
//import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
//
//@WebMvcTest(UserController.class)
//class UserControllerTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @MockitoBean
//    private UserService userService; // Mock injected into controller
//
//    private User user1;
//    private User user2;
//
//    @BeforeEach
//    void setUp() {
//        user1 = User.builder()
//                .id(1L)
//                .firstName("John")
//                .lastName("Doe")
//                .email("john@example.com")
//                .password("password")
//                .role(Role.CUSTOMER)
//                .build();
//
//        user2 = User.builder()
//                .id(2L)
//                .firstName("Jane")
//                .lastName("Smith")
//                .email("jane@example.com")
//                .password("password")
//                .role(Role.ADMIN)
//                .build();
//    }
//
//    @Test
//    @WithMockUser(roles = "ADMIN")
//    void getAllUsers_ShouldReturnListOfUsers_WhenAdmin() throws Exception {
//        List<User> users = Arrays.asList(user1, user2);
//        when(userService.getAllUsers()).thenReturn(users);
//
//        mockMvc.perform(get("/users")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.size()", is(2)))
//                .andExpect(jsonPath("$[0].email", is("john@example.com")))
//                .andExpect(jsonPath("$[1].email", is("jane@example.com")));
//    }
//
//    @Test
//    @WithMockUser(roles = "ADMIN")
//    void getUserById_ShouldReturnUser_WhenAdmin() throws Exception {
//        when(userService.getUserById(anyLong())).thenReturn(user1);
//
//        mockMvc.perform(get("/users/{userId}", 1L)
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isOk())
//                .andExpect(jsonPath("$.email", is("john@example.com")))
//                .andExpect(jsonPath("$.firstName", is("John")))
//                .andExpect(jsonPath("$.lastName", is("Doe")));
//    }
//
//    @Test
//    @WithMockUser(roles = "USER")
//    void getAllUsers_ShouldReturnForbidden_WhenNotAdmin() throws Exception {
//        mockMvc.perform(get("/users")
//                        .contentType(MediaType.APPLICATION_JSON))
//                .andExpect(status().isForbidden());
//    }
//}
