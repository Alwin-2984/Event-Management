package com.innovature.eventmanagement;

import com.innovature.eventmanagement.util.LanguageUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
@Configuration
public class EventManagementApplication {

  @Value("${local.host.endpoint1}")
  private String localEndPoint1;

  @Value("${local.host.endpoint2}")
  private String localEndPoint2;

  @Value("${server.user.endpoint}")
  private String serverUserEndpoint;

  @Value("${server.admin.endpoint}")
  private String serverAdminEndpoint;

  @Bean
  public WebMvcConfigurer webMvcConfigurer() {
    return new WebMvcConfigurer() {
      @Override
      public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*").allowedOrigins(localEndPoint1,localEndPoint2,serverUserEndpoint,serverAdminEndpoint).allowCredentials(true);
      }
    };
  }

  public static void main(String[] args) {
    SpringApplication.run(EventManagementApplication.class, args);
  }

  @Bean
  public LanguageUtil languageUtil() {
    return new LanguageUtil();
  }

  @Bean
  public MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
    messageSource.setBasename("classpath:messages");
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
  }
}
