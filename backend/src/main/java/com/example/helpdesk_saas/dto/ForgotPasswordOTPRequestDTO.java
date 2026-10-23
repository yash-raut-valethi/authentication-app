package com.example.helpdesk_saas.dto;


import lombok.Data;

@Data
public class ForgotPasswordOTPRequestDTO {
    private String email;
    private String otp;
}
