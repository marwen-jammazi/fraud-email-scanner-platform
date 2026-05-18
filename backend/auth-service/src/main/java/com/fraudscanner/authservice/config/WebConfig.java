package com.fraudscanner.authservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${app.upload.profile-pictures-dir:uploads/profile-pictures}")
    private String profilePicturesDir;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String absolutePath = Paths.get(profilePicturesDir).toAbsolutePath().normalize().toString();

        registry.addResourceHandler("/uploads/profile-pictures/**")
                .addResourceLocations("file:" + absolutePath + "/");
    }
}