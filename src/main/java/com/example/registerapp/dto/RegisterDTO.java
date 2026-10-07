package com.example.registerapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

@Data
public class RegisterDTO {

    @Size(max= 100, message="Name must not exceed 100 characters")
    private String name;
    @NotBlank
    @Email(message="Please provide a valid email address")
    private String email;
    @NotBlank
    private String password;
}
