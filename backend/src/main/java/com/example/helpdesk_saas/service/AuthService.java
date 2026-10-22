package com.example.helpdesk_saas.service;

import com.example.helpdesk_saas.exception.EmailException;
import com.example.helpdesk_saas.exception.InvalidCredentialsException;
import com.example.helpdesk_saas.exception.UserAlreadyExistException;
import com.example.helpdesk_saas.exception.UserNotFoundException;
import com.example.helpdesk_saas.models.BlackListedAccessToken;
import com.example.helpdesk_saas.models.User;
import com.example.helpdesk_saas.repository.BlackListedAccessTokenRepository;
import com.example.helpdesk_saas.repository.UserRepository;
import com.example.helpdesk_saas.security.JwtService;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BlackListedAccessTokenRepository blackListedAccessTokenRepository;
    private final StringRedisTemplate redisTemplate;
    private final MailService mailService;

    public AuthService(PasswordEncoder passwordEncoder, UserRepository userRepository, JwtService jwtService, BlackListedAccessTokenRepository blackListedAccessTokenRepository,StringRedisTemplate redisTemplate,MailService mailService) {
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.blackListedAccessTokenRepository = blackListedAccessTokenRepository;
        this.redisTemplate = redisTemplate;
        this.mailService= mailService;
    }

    public String registerUser(String name, String email, String password){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isPresent()){
            throw new UserAlreadyExistException("User with Email already exist.");
        }
        User user = new User();
        user.setEmail(email);
        user.setName(name);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return "User registered successfully.";
    }



    public String loginUser(String email, String password){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new UserNotFoundException("Email id not registered. Please register first.");
        }
        User user = optionalUser.get();
        if(!passwordEncoder.matches(password,user.getPassword())){
            throw new InvalidCredentialsException("Invalid Credentials");
        }

        return jwtService.generateToken(
                email
        );
    }

    public void logout(String token){
        Optional<BlackListedAccessToken> optionalToken = blackListedAccessTokenRepository.findByToken(token);
        if(optionalToken.isEmpty()){
           BlackListedAccessToken blacklistToken = new BlackListedAccessToken();
           blacklistToken.setToken(token);
           blackListedAccessTokenRepository.save(blacklistToken);
        }
    }


    public String forgotPassword(String email){
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if(optionalUser.isEmpty()){
            throw new UserNotFoundException("Email id not registered. Please register first.");
        }
        String otp = generateOTP();
        redisTemplate.opsForValue().set(email, otp);
        try{
            String to = email;
            String subject = "OTP for Login on HelpDesk" ;
            String text =  "Hello HelpDesk User! ,\n"+ "Below is your OTP for login using forgot password: \n" + otp ;
            mailService.sendSimpleMail(to,subject,text);
        }
        catch(Exception e){
            throw new EmailException("Error sending email to the user.");
        }
        return "Please check the OTP sent to the email ID";

    }


    private String generateOTP(){
        String otp ="";
        Random random = new Random();
        for(int i=1;i<=6;i++){
            otp += random.ints(0,10);
        }
        return otp;
    }

}
