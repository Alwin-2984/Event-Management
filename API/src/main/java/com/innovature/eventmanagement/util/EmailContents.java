package com.innovature.eventmanagement.util;

import org.springframework.stereotype.Component;

@Component
public class EmailContents {

    private static final String DIV = "</div>";

    // Email Content for verifying otp during signup
    public String signupEmailContent(String otp) {
        return ("<div style=\"color: black;\">"
                + "You are just a step away from accessing your Event management platform account.<br>\n" + "\n"
                + "We are sharing a verification code to access your account. The code is valid for 2 minutes and usable only once<br>\n"
                + "Once you have verified the code, your account will be verified.<br>\n" + "<br>\n"
                + "This is to ensure that only you have access to your account.<br>\n" + "Your OTP :"
                + "<div style=\" border-radius: 4px; display: inline-block; padding: 8px;\">"
                + "<span style=\"font-size: 24px; font-weight: bold;\">" + otp + "</span>" + DIV + "<br>\n"
                + "Expires in: 2 minutes" + DIV);
    }

    // Email Content for otp verification during forgotpassword actions
    public String forgotPasswordEmailContent(String otp) {
        return ("<div style=\"color: black;\">" + "Hello,<br><br>"
                + "You have requested to reset your password for the Event Management Platform account.<br><br>"
                + "Please use the verification code below to proceed with the password reset process. The code is valid for 2 minutes and can only be used once:<br><br>"
                + "<div style=\"background-color: #f2f2f2; border-radius: 4px; display: inline-block; padding: 8px;\">"
                + "<span style=\"font-size: 24px; font-weight: bold;\">" + otp + "</span>" + DIV + "<br><br>"
                + "If you didn't request this password reset, you can safely ignore this email; your account will not be changed.<br><br>"
                + "Best regards,<br>" + "Your Event Management Platform Team" + DIV);
    }
}
