package com.example.helpdesk_saas.controller;


import com.example.helpdesk_saas.dto.PasswordResetRequestDTO;
import com.example.helpdesk_saas.dto.ProfileResponseDTO;
import com.example.helpdesk_saas.service.ProfileService;
import jakarta.validation.Valid;
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


    @PostMapping("/password/reset/verify")
    public void resetPasswordAuthenticate(@RequestBody String currentPassword){
        profileService.verifyCurrentPassword(currentPassword);
    }

    @PostMapping("/password/reset")
    public void resetPassword(@Valid @RequestBody PasswordResetRequestDTO requestDTO){
        profileService.resetPassword(requestDTO.getPassword());
    }
}
