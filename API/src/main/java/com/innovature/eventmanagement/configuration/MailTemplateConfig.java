package com.innovature.eventmanagement.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactoryBean;

@Configuration
public class MailTemplateConfig {

  @Bean
  @Qualifier("emailTemplateConfiguration") // Add this qualifier
  public FreeMarkerConfigurationFactoryBean emailTemplateConfiguration() {
    FreeMarkerConfigurationFactoryBean bean = new FreeMarkerConfigurationFactoryBean();
    bean.setTemplateLoaderPath("classpath:/templates");
    bean.setDefaultEncoding("UTF-8");
    return bean;
  }
}
