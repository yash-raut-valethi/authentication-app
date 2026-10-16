package com.example.registerapp.controller;


import com.example.registerapp.dto.PasswordResetRequestDTO;
import com.example.registerapp.dto.ProfileResponseDTO;
import com.example.registerapp.service.ProfileService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class ProfileController {
    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }


    @GetMapping("/details")
    public ProfileResponseDTO getUserDetails(){
        return profileService.getUserDetails();
    }


    @PostMapping("/password/reset")
    public void resetPassword(@RequestBody PasswordResetRequestDTO requestDTO){
        profileService.resetPassword(requestDTO.getPassword());
    }
}
