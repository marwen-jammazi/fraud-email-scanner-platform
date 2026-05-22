package com.fraudscanner.scannerservice.client;

import com.fraudscanner.scannerservice.dto.MlPredictionRequest;
import com.fraudscanner.scannerservice.dto.MlPredictionResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Slf4j
@Service
public class MlServiceClient {

    private final RestClient restClient;

    public MlServiceClient(
            @Value("${services.ml-service.url:http://localhost:8000}") String mlServiceUrl
    ) {
        this.restClient = RestClient.builder()
                .baseUrl(mlServiceUrl)
                .build();
    }

    public MlPredictionResponse predict(MlPredictionRequest request) {
        try {
            log.info("Sending email content to ML service for prediction.");

            MlPredictionResponse response = restClient.post()
                    .uri("/api/ml/predict")
                    .body(request)
                    .retrieve()
                    .body(MlPredictionResponse.class);

            if (response == null) {
                log.warn("ML service returned an empty response.");
                return buildFallbackResponse("ML service returned an empty response");
            }

            log.info(
                    "ML prediction received successfully. Prediction: {}, probability: {}, risk level: {}",
                    response.getPrediction(),
                    response.getFraudProbability(),
                    response.getRiskLevel()
            );

            return response;

        } catch (Exception exception) {
            log.error(
                    "ML service request failed. Falling back to rule-based analysis. Error: {}",
                    exception.getMessage()
            );

            return buildFallbackResponse(
                    "ML service unavailable; rule-based analysis applied"
            );
        }
    }

    private MlPredictionResponse buildFallbackResponse(String reason) {
        return MlPredictionResponse.builder()
                .fraudProbability(0.0)
                .prediction("UNAVAILABLE")
                .riskLevel("LOW")
                .reasons(List.of(reason))
                .modelVersion("fallback-rule-only")
                .build();
    }
}