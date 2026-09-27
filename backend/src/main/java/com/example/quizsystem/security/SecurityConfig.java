package com.example.quizsystem.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public health, auth and docs endpoints
                        .requestMatchers("/api/health/**", "/api/v1/health/**", "/api/auth/**", "/api/v1/auth/**").permitAll()
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()

                        // Public read-only catalog endpoints
                        .requestMatchers(HttpMethod.GET, "/api/subjects/**", "/api/v1/subjects/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/exams/**", "/api/v1/exams/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/leaderboard/**", "/api/v1/leaderboard/**", "/api/analytics/leaderboard/**", "/api/v1/analytics/leaderboard/**").permitAll()

                        // Admin management endpoints
                        .requestMatchers("/api/admin/**", "/api/v1/admin/**", "/api/analytics/admin/**", "/api/v1/analytics/admin/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/subjects/**", "/api/v1/subjects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/subjects/**", "/api/v1/subjects/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/subjects/**", "/api/v1/subjects/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/exams/**", "/api/v1/exams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/exams/**", "/api/v1/exams/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/exams/**", "/api/v1/exams/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/questions/**", "/api/v1/questions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/questions/**", "/api/v1/questions/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/questions/**", "/api/v1/questions/**").hasRole("ADMIN")

                        // Any other request requires authentication
                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
