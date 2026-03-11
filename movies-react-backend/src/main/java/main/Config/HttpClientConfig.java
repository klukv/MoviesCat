package main.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

public class HttpClientConfig {
    @Value("${recommendation.client.connect-timeout-ms:2000}")
    private int connectTimeout;

    @Value("${recommendation.client.read-timeout-ms:3000}")
    private int readTimeout;

    @Bean
    public RestTemplate recommendationRestTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();

        factory.setConnectTimeout(connectTimeout);
        factory.setReadTimeout(readTimeout);

        return new RestTemplate(factory);
    }
}
