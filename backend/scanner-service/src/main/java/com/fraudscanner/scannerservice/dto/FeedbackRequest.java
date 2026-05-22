package com.fraudscanner.scannerservice.dto;

import com.fraudscanner.scannerservice.enums.FeedbackLabel;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeedbackRequest {

    @NotNull(message = "Email ID is required")
    private Long emailId;

    private Long userId;

    private String performedBy;

    @NotNull(message = "Feedback label is required")
    private FeedbackLabel label;

    private String comment;
}