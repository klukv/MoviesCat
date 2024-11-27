package main.models;

import com.fasterxml.jackson.annotation.*;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Movies")
public class Movies {

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
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_fmovies", joinColumns = @JoinColumn(name = "movie_id"),
    inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private List<User> users;

    public Movies() {
    }

    public Movies(String title, String description, Integer year, String country, String genre, String director, Integer time, Integer budget, String imgUrl, String type) {
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
}
