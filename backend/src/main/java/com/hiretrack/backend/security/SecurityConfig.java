
package com.hiretrack.backend.security;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import java.util.Base64;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.nimbusds.jose.jwk.source.ImmutableSecret;

@Configuration
public class SecurityConfig {

    @Value("${HIRETRACK_JWT_SECRET}")
    private String jwtSecret;

    @Bean
    public SecretKey secretKey() {
        byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
        return new SecretKeySpec(keyBytes, "HmacSHA256");
    }

    @Bean
    public JwtEncoder jwtEncoder(SecretKey secretKey) {
        return new NimbusJwtEncoder(
                new ImmutableSecret<>(secretKey)
        );
    }

    @Bean
    public JwtDecoder jwtDecoder(SecretKey secretKey) {
        return NimbusJwtDecoder
                .withSecretKey(secretKey)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();

        authoritiesConverter.setAuthoritiesClaimName("role");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter converter =
                new JwtAuthenticationConverter();

        converter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return converter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticationConverter jwtAuthenticationConverter)
            throws Exception {

        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/users/register",
                        "/api/users/login"
                ).permitAll()

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/jobs",
                        "/api/jobs/*"
                ).permitAll()

                .requestMatchers(
                        "/api/users/candidates"
                ).hasRole("ADMIN")

                .requestMatchers(
                        "/api/admin/**"
                ).hasRole("ADMIN")

                .requestMatchers(
                        "/api/users/profile/**"
                ).hasAnyRole("CANDIDATE", "RECRUITER")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/jobs"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/jobs/recruiter/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.DELETE,
                        "/api/jobs/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.POST,
                        "/api/applications/**"
                ).hasRole("CANDIDATE")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/applications/candidate/**"
                ).hasRole("CANDIDATE")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/applications/recruiter/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.PUT,
                        "/api/applications/**"
                ).hasRole("RECRUITER")

                .requestMatchers(
                        HttpMethod.GET,
                        "/api/applications/*/resume"
                ).hasRole("RECRUITER")

                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth
                    .jwt(jwt -> jwt
                            .jwtAuthenticationConverter(jwtAuthenticationConverter)
                    )
            );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
               java.util.List.of(
    "http://localhost:5173",
    "https://hire-track-inky.vercel.app"
)
        )

        configuration.setAllowedMethods(
                java.util.List.of(
                        "GET", "POST", "PUT", "DELETE", "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                java.util.List.of("Authorization", "Content-Type")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
