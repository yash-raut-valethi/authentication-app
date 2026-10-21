package com.example.helpdesk_saas.models;


import jakarta.persistence.Entity;
import lombok.Data;

@Entity
@Data
public class BlackListedAccessToken extends Basemodel {

    private String token;
}
