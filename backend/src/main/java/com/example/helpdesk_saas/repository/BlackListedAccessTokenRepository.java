package com.example.helpdesk_saas.repository;

import com.example.helpdesk_saas.models.BlackListedAccessToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlackListedAccessTokenRepository extends JpaRepository<BlackListedAccessToken,Long>{

    Optional<BlackListedAccessToken> findByToken(String token);
}
