package com.example.helpdesk_saas.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class PasswordResetRequestDTO {
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
