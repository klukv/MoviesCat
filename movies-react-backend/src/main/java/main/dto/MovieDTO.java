package main.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MovieDTO {
    private Long id;
    private String title;
    private String description;
    private Integer year;
    private String country;
    private String genre;
    private String director;
    private Integer time;
    private Integer budget;
    private String imgUrl;
    private String type;
    private double score; // score из рекомендаций, обогащённый данными из БД
}
