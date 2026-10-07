package com.example.registerapp.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginDTO {
    @NotBlank
    @Email(message="Please provide a valid email address")
    private String email;
    @NotBlank
    private String password;
}
