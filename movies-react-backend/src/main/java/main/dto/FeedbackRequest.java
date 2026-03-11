package main.dto;

import lombok.Data;

import javax.validation.constraints.Pattern;

@Data
public class FeedbackRequest {

    private String userId;

    private String movieId;

    // Допустимые значения строго ограничены — всё остальное вернёт 400
    @Pattern(
            regexp = "watch|rate|skip",
            message = "action должен быть одним из: watch, rate, skip"
    )
    private String action;
}