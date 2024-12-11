package com.admin.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Movies")
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    @Column(name="description", length = 3000)
    private String description;
    private Integer year;
    private String country;
    private String genre;
    private String director;
    private Integer time;
    private Integer budget;
    private String imgUrl;
    private String type;

    public Movie() {

    }

    public Movie(String title, String description, Integer year, String country, String genre, String director, Integer time, Integer budget, String imgUrl, String type) {
        super();
        this.title = title;
        this.description = description;
        this.year = year;
        this.country = country;
        this.genre = genre;
        this.director = director;
        this.time = time;
        this.budget = budget;
        this.imgUrl = imgUrl;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Integer getYear() {
        return year;
    }

    public String getCountry() {
        return country;
    }

    public String getGenre() {
        return genre;
    }

    public String getDirector() {
        return director;
    }

    public Integer getTime() {
        return time;
    }

    public Integer getBudget() {
        return budget;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public String getType() {
        return type;
    }
}
