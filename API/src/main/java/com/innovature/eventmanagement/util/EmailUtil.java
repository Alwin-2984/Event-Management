package com.innovature.eventmanagement.util;

import com.innovature.eventmanagement.exception.BadRequestException;
import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

@Component
public class EmailUtil {

    private static final String MAIL_TEMPLATE_ERROR = "unable.to.perform.this.action";
    private static final String MAIL_NOT_SEND_LOG = "mail not send";

    private static final String TEMPLATE_NAME = "email_template.html";

    Logger log = LoggerFactory.getLogger(EmailUtil.class);

    @Autowired
    @Qualifier("emailTemplateConfiguration")
    private Configuration config;

    @Value("${spring.mail.username}")
    private String mailSender;

    @Value("${spring.mail.password}")
    private String passwordSender;

    @Autowired
    private LanguageUtil languageUtil;

    @Value("${global.language}")
    private String globalLanguage;

    @Value("${email.util.status}")
    private boolean enableEmailUtil;

    /**
     * Sends an email using the provided content and subject to the specified
     * recipient.
     *
     * @param to      The email address of the recipient.
     * @param content The content of the email
     * @param subject The subject of the email.
     */
    public void sendEmail(String to, String content, String subject) {
        if (enableEmailUtil) { // Check if the email utility is enabled
            String senderEmail = mailSender;
            String senderPassword = passwordSender;
            Properties properties = new Properties();
            properties.put("mail.smtp.auth", "true");
            properties.put("mail.smtp.starttls.enable", "true");
            properties.put("mail.smtp.host", "smtp.gmail.com");
            properties.put("mail.smtp.port", "587");
            // Create a session with the specified email server and authenticator
            Session session = Session.getInstance(properties, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(senderEmail, senderPassword);
                }
            });
            try {
                MimeMessage message = new MimeMessage(session);
                MimeMessageHelper helper = new MimeMessageHelper(message,
                        MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
                Template t = config.getTemplate(TEMPLATE_NAME); // Configures custom template
                Map<String, Object> dataModel = new HashMap<>();
                dataModel.put("CONTENT", content);
                String html = FreeMarkerTemplateUtils.processTemplateIntoString(t, dataModel);
                helper.setFrom(new InternetAddress(senderEmail));
                helper.setTo(to);
                helper.setSubject(subject);
                helper.setText(html, true);
                Transport.send(message);
            } catch (MessagingException | IOException | TemplateException e) {
                log.error(MAIL_NOT_SEND_LOG);
                throw new BadRequestException(languageUtil.getTranslatedText(MAIL_TEMPLATE_ERROR, null, globalLanguage),
                        e);
            }
        }
    }
}
