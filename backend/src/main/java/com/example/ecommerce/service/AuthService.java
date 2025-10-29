package com.example.ecommerce.service;

import com.example.ecommerce.dto.request.LoginRequestDto;
import com.example.ecommerce.dto.request.RegisterRequestDto;
import com.example.ecommerce.dto.response.AuthResponseDto;
import com.example.ecommerce.model.Cart;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.enums.Role;
import com.example.ecommerce.repository.CartRepository;
import com.example.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AuthService
{
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserService userService;
    private final JWTService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CartRepository cartRepository;

    public AuthResponseDto register(RegisterRequestDto registerRequestDto){
        if(userRepository.findByEmail(registerRequestDto.getEmail()).isPresent()){
            throw  new IllegalArgumentException("Email already registered");
        }

        User user = User.builder()
                .firstName(registerRequestDto.getFirstName())
                .lastName(registerRequestDto.getLastName())
                .email(registerRequestDto.getEmail())
                .password(passwordEncoder.encode(registerRequestDto.getPassword()))
                .role(Role.CUSTOMER)
                .orders(new ArrayList<>())
                .build();

        User savedUser = userRepository.save(user);


        Cart cart = Cart.builder()
                .user(savedUser)
                .cartProducts(new ArrayList<>())
                .build();
        cartRepository.save(cart);

        String jwToken = jwtService.generateToken(savedUser);

        return AuthResponseDto.builder().accessToken(jwToken).build();
    }

    public AuthResponseDto login(LoginRequestDto loginRequestDto){
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getEmail(),
                    loginRequestDto.getPassword()));
        }
        catch (AuthenticationException ex){
            throw  new IllegalArgumentException("Invalid credentials", ex);
        }

//        UserDetails user = userService.loadUserByUsername(loginRequestDto.getEmail());
        User user = userService.getUserByEmail(loginRequestDto.getEmail());
        String jwToken = jwtService.generateToken(user);

        return AuthResponseDto.builder().accessToken(jwToken).build();
    }

    public AuthResponseDto registerAdmin(RegisterRequestDto requestDto){
        User admin = User.builder()
                .firstName(requestDto.getFirstName())
                .lastName(requestDto.getLastName())
                .email(requestDto.getEmail())
                .password(passwordEncoder.encode(requestDto.getPassword()))
                .role(Role.ADMIN)
                .build();

        User registeredUser = userRepository.save(admin);
        String token = jwtService.generateToken(registeredUser);
        return AuthResponseDto.builder().accessToken(token).build();
    }
}
