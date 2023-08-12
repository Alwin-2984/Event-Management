package com.innovature.eventmanagement.configuration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innovature.eventmanagement.security.AccessTokenProcessingFilter;
import com.innovature.eventmanagement.security.AccessTokenUserDetailsService;
import com.innovature.eventmanagement.security.config.SecurityConfig;
import com.innovature.eventmanagement.security.util.TokenGenerator;
import com.innovature.eventmanagement.util.Constants;
import com.innovature.eventmanagement.view.ResponseView;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
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
  public SecurityFilterChain securityFilterChain(HttpSecurity http)
    throws Exception {
    AuthenticationManagerBuilder authManagerBuilder = http.getSharedObject(
      AuthenticationManagerBuilder.class
    );

    AuthenticationManager authenticationManager = authManagerBuilder
      .authenticationProvider(preAuthenticatedAuthenticationProvider())
      .build();

    http
      .authenticationManager(authenticationManager)
      .addFilter(new AccessTokenProcessingFilter(authenticationManager))
      .securityContext()
      .and()
      .sessionManagement()
      .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
      .and()
      .exceptionHandling()
      .accessDeniedHandler((request, response, e) -> {
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.FORBIDDEN.value());
        ObjectMapper mapper = new ObjectMapper();
        ResponseView errorResponse = new ResponseView(
          "Current user doesn't have permission to perform this action",
          "1002"
        );
        mapper.writeValue(response.getWriter(), errorResponse);
      })
      .and()
      .headers()
      .and()
      .cors()
      .and()
      .csrf()
      .disable()
      .logout()
      .disable()
      .anonymous()
      .and()
      .authorizeRequests(requests ->
        requests
          .antMatchers("/error")
          .permitAll()
          .antMatchers(
            "/",
            "/admin/login",
            "/organizer",
            "/user",
            "/user/verify",
            "/organizer/verify",
            "/organizer/login",
            "/user/googleAuth",
            "/user/login",
            "/user/forgotPassword",
            "/user/verifyForgotPassword",
            "/user/setPassword"
          )
          .permitAll()
          .antMatchers("/admin/activeUserCount")
          .hasRole(Constants.ADMIN)
          .antMatchers("/admin/users")
          .hasRole(Constants.ADMIN)
          .antMatchers("/admin/organizers")
          .hasRole(Constants.ADMIN)
          .antMatchers("/admin/users/{id}/{status}")
          .hasRole(Constants.ADMIN)
          .antMatchers("/admin/categories/**")
          .hasRole(Constants.ADMIN)
          
          .anyRequest()
          .authenticated()
      );
    return http.build();
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
    authProvider.setPreAuthenticatedUserDetailsService(
      accessTokenUserDetailsService()
    );

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
    return new TokenGenerator(
      securityConfig.getTokenGeneratorPassword(),
      securityConfig.getTokenGeneratorSalt()
    );
  }
}
