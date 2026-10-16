package com.example.registerapp.controller;


import com.example.registerapp.dto.LoginDTO;
import com.example.registerapp.dto.RegisterDTO;
import com.example.registerapp.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterDTO registerDTO){
        String response =
      authService.registerUser(registerDTO.getName(),registerDTO.getEmail(), registerDTO.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
   public ResponseEntity<String> loginUser(@Valid @RequestBody LoginDTO loginDTO, HttpServletResponse response){
        String token =
                authService.loginUser(loginDTO.getEmail(),loginDTO.getPassword());
        ResponseCookie cookie = ResponseCookie.from("jwtToken", token)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(Duration.ofDays(1))
                .sameSite("Strict")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        return ResponseEntity.ok("Login Successful");
    }

}





