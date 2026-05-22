package com.fraudscanner.scannerservice.client;

import com.fraudscanner.scannerservice.dto.AuditLogRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class AuditServiceClient {

    private final RestClient restClient;

    public AuditServiceClient(
            @Value("${services.audit-service.url:http://localhost:8083}") String auditServiceUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(auditServiceUrl)
                .build();
    }

    public void createAuditLog(AuditLogRequest request) {
        restClient.post()
                .uri("/api/audit")
                .body(request)
                .retrieve()
                .toBodilessEntity();
    }
}