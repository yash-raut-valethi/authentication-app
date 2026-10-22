package com.example.helpdesk_saas.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;


@Service
public class MailService {
    private final JavaMailSender mailSender;
    @Value("{GMAIL_USERNAME}")
    private final String emailFrom;


    public MailService(JavaMailSender mailSender,String emailFrom) {
        this.mailSender = mailSender;
        this.emailFrom= emailFrom;
    }

    public void sendSimpleMail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom(emailFrom);
        mailSender.send(message);
    }
}
