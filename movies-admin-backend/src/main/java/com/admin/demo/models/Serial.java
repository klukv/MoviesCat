package com.admin.demo.models;

import jakarta.persistence.*;

@Entity
@Table(name = "Serials")
public class Serial {

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
    private String imgUrl;

    public Serial() {

    }

    public Serial(String title, String description, Integer year, String country, String genre, String director, Integer time, String imgUrl) {
        super();
        this.title = title;
        this.description = description;
        this.year = year;
        this.country = country;
        this.genre = genre;
        this.director = director;
        this.time = time;
        this.imgUrl = imgUrl;
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

    public String getImgUrl() {
        return imgUrl;
    }
}
