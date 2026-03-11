package main.client;

import lombok.extern.slf4j.Slf4j;
import main.dto.RecommendationResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Optional;

@Slf4j
@Service
public class RecommendationClient {
    private final RestTemplate restTemplate;
    private final String baseUrl;

    public RecommendationClient(
          @Qualifier("recommendationRestTemplate") RestTemplate restTemplate,
          @Value("${recommendation.service.url}") String baseUrl) {
        this.restTemplate = restTemplate;
        this.baseUrl = baseUrl;
    }

    public RecommendationResponse getRecommendations(
            String userId,
            int limit,
            String context,
            String genre,
            boolean excludeWatched
    ) {
        String url = UriComponentsBuilder
                .fromHttpUrl(baseUrl + "/recommendations" + userId)
                .queryParam("limit", limit)
                .queryParam("context", context)
                .queryParam("exclude_watched", excludeWatched)
                .queryParamIfPresent("genre", Optional.ofNullable(genre))
                .toUriString();

        log.debug("Запрос рекомендаций: {}", url);

        try {
            RecommendationResponse response = restTemplate.getForObject(url, RecommendationResponse.class);

            if (response == null) {
                log.warn("Recommendation Service вернул пустое тело для user_id={}", userId);
                return RecommendationResponse.empty(userId);
            }

            log.info("Рекомендации получены: user_id={}, cache_hit={}, count={}",
                    userId, response.isCacheHit(), response.getRecommendations().size());

            return response;
        } catch (HttpServerErrorException e) {
            log.error("Recommendation service вернул ошибку {}: {}", e.getStatusCode(), e.getMessage());
            return RecommendationResponse.empty(userId);
        } catch (ResourceAccessException e) {
            log.error("Recommendation Service недоступен (timeout/connection): {}",
                    e.getMessage());
            return RecommendationResponse.empty(userId);
        } catch (Exception e) {
            log.error("Неожиданная ошибка при запросе рекомендаций: {}", e.getMessage(), e);
            return RecommendationResponse.empty(userId);
        }
    }
}
