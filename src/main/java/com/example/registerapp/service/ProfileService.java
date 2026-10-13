package com.example.registerapp.service;


import com.example.registerapp.dto.ProfileResponseDTO;
import com.example.registerapp.models.User;
import com.example.registerapp.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ProfileService {

    public ProfileResponseDTO getUserDetails() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null
                || !auth.isAuthenticated()
                || auth instanceof AnonymousAuthenticationToken) {
            throw new AccessDeniedException("Not authenticated");
        }

        User user = (User) auth.getPrincipal();

        ProfileResponseDTO profileDTO = new ProfileResponseDTO();
        profileDTO.setEmail(user.getEmail());
        profileDTO.setName(user.getName());

        return profileDTO;
    }
}
