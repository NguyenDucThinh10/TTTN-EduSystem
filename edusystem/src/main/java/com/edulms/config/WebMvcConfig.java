package com.edulms.config;

import java.nio.file.Path;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    private final String submissionsDir;
    private final String assignmentsDir;

    public WebMvcConfig(
            @Value("${edulms.upload.submissions-dir:uploads/submissions}") String submissionsDir,
            @Value("${edulms.upload.assignments-dir:uploads/assignments}") String assignmentsDir) {
        this.submissionsDir = submissionsDir;
        this.assignmentsDir = assignmentsDir;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(submissionsDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/submissions/**")
                .addResourceLocations(location);

        String assignmentLocation = Path.of(assignmentsDir).toAbsolutePath().normalize().toUri().toString();
        registry.addResourceHandler("/uploads/assignments/**")
                .addResourceLocations(assignmentLocation);
    }
}
