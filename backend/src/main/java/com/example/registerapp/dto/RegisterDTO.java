package com.example.registerapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(
            regexp = "^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{8,}$",
            message = "Please create a strong password following:\n" +
                    "• Minimum 8 characters length\n" +
                    "• 2 letters in Upper Case\n" +
                    "• 1 Special Character (!@#$&*)\n" +
                    "• 2 numerals (0-9)\n" +
                    "• 3 letters in Lower Case"
    )
    private String password;
}
