package com.example.helpdesk_saas.dto;

import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class ForgotPasswordRequestDTO{

    @Email
    private String email;

}
