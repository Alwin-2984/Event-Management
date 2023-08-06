package com.innovature.eventmanagement.configuration;

import com.innovature.eventmanagement.security.AccessTokenUserDetailsService;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationProvider;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;

@Configuration
@EnableWebSecurity
public class WebSecurityConfiguration {

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http.authorizeHttpRequests(auth -> {
      auth.antMatchers("/").permitAll();
      auth.antMatchers("/admin/login").permitAll();
      auth.antMatchers("/organizer").permitAll();
      auth.antMatchers("/user").permitAll();
      auth.antMatchers("/user/verify").permitAll();
      auth.antMatchers("/organizer/verify").permitAll();
      auth.antMatchers("/organizer/login").permitAll();
      auth.antMatchers("/user/googleAuth").permitAll();
      auth.antMatchers("/user/login").permitAll();
      auth.antMatchers("/user/forgotPassword").permitAll();
      auth.antMatchers("/user/verifyForgotPassword").permitAll();
      auth.antMatchers("/user/setPassword").permitAll();
      auth.antMatchers("/admin/users").permitAll();
      auth.antMatchers("/admin/activeUserCount").permitAll();
      auth.antMatchers("/admin/users/{id}/{status}").permitAll();
      auth.anyRequest().authenticated();
    }).csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)).httpBasic(it -> {
        }).build();
  }

  @Bean
  protected AccessTokenUserDetailsService accessTokenUserDetailsService() {
    return new AccessTokenUserDetailsService();
  }

  @Bean
  public HttpFirewall httpFirewall() {
    StrictHttpFirewall firewall = new StrictHttpFirewall();
    firewall.setAllowUrlEncodedPercent(true);
    return firewall;
  }

  @Bean
  protected PreAuthenticatedAuthenticationProvider preAuthenticatedAuthenticationProvider() {
    PreAuthenticatedAuthenticationProvider authProvider = new PreAuthenticatedAuthenticationProvider();
    authProvider.setPreAuthenticatedUserDetailsService(accessTokenUserDetailsService());

    return authProvider;
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  @ConfigurationProperties("app.security")
  public SecurityConfig securityConfig() {
    return new SecurityConfig();
  }

  @Bean
  @ConfigurationProperties("app.security.configuration")
  public TokenGenerator tokenGenerator(SecurityConfig securityConfig) {
    return new TokenGenerator(securityConfig.getTokenGeneratorPassword(), securityConfig.getTokenGeneratorSalt());
  }
}
