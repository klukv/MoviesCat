package main.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MovieScore {

    // Jackson маппит snake_case из JSON ("movie_id") в camelCase поле
    @JsonProperty("movie_id")
    private Long movieId;

    private double score;
}