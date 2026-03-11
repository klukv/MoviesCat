package main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
public class RecommendationResponse {

    @JsonProperty("user_id")
    private String userId;

    @JsonProperty("cache_hit")
    private boolean cacheHit;

    private List<MovieScore> recommendations;

    // Fallback-объект: когда Recommendation Service недоступен,
    // возвращаем пустой список вместо того, чтобы бросать исключение
    public static RecommendationResponse empty(String userId) {
        RecommendationResponse response = new RecommendationResponse();
        response.setUserId(userId);
        response.setCacheHit(false);
        response.setRecommendations(Collections.emptyList());
        return response;
    }
}
