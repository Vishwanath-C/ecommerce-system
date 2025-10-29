package com.example.ecommerce.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponseDto
{
    private String message;
    private int status;
    private final LocalDateTime timestamp = LocalDateTime.now();
    private Map<String, String> fieldErrors;
    private String path;
}
