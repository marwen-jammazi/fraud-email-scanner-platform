package com.fraudscanner.scannerservice.service;

import com.fraudscanner.scannerservice.client.AuditServiceClient;
import com.fraudscanner.scannerservice.dto.AuditLogRequest;
import com.fraudscanner.scannerservice.dto.FeedbackRequest;
import com.fraudscanner.scannerservice.entity.EmailMessage;
import com.fraudscanner.scannerservice.entity.UserFeedback;
import com.fraudscanner.scannerservice.enums.AuditEventType;
import com.fraudscanner.scannerservice.enums.FeedbackLabel;
import com.fraudscanner.scannerservice.repository.EmailMessageRepository;
import com.fraudscanner.scannerservice.repository.UserFeedbackRepository;
import org.springframework.stereotype.Service;

@Service
public class FeedbackService {

    private final EmailMessageRepository emailMessageRepository;
    private final UserFeedbackRepository userFeedbackRepository;
    private final AuditServiceClient auditServiceClient;

    public FeedbackService(
            EmailMessageRepository emailMessageRepository,
            UserFeedbackRepository userFeedbackRepository,
            AuditServiceClient auditServiceClient
    ) {
        this.emailMessageRepository = emailMessageRepository;
        this.userFeedbackRepository = userFeedbackRepository;
        this.auditServiceClient = auditServiceClient;
    }

    public String submitFeedback(FeedbackRequest request) {
        EmailMessage emailMessage = emailMessageRepository
                .findById(request.getEmailId())
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String reviewerName = resolvePerformedBy(request.getPerformedBy());

        UserFeedback feedback = UserFeedback.builder()
                .userId(request.getUserId())
                .label(request.getLabel())
                .comment(request.getComment())
                .emailMessage(emailMessage)
                .build();

        userFeedbackRepository.save(feedback);

        AuditEventType eventType = AuditEventType.FEEDBACK_SUBMITTED;

        if (request.getLabel() == FeedbackLabel.FALSE_POSITIVE) {
            eventType = AuditEventType.EMAIL_MARKED_FALSE_POSITIVE;
        } else if (request.getLabel() == FeedbackLabel.CONFIRMED_FRAUD) {
            eventType = AuditEventType.EMAIL_CONFIRMED_FRAUD;
        }

        AuditLogRequest auditLogRequest = AuditLogRequest.builder()
                .emailId(emailMessage.getId())
                .userId(request.getUserId())
                .eventType(eventType)
                .performedBy(reviewerName)
                .details("Feedback submitted by " + reviewerName + ": " + request.getLabel())
                .build();

        auditServiceClient.createAuditLog(auditLogRequest);

        return "Feedback submitted successfully";
    }

    private String resolvePerformedBy(String performedBy) {
        if (performedBy == null || performedBy.isBlank()) {
            return "Unknown User";
        }

        return performedBy.trim();
    }
}