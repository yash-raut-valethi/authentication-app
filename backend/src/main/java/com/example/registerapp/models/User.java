package com.example.registerapp.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Table(name= "users")
@Entity
public class User extends Basemodel{

    private String name;
    private String email;
    private String password;

}
