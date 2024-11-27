package main.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Serials")
public class Serials {

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
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_fserials", joinColumns = @JoinColumn(name = "serial_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id"))
    @JsonIgnore
    private List<User> users;

    public Serials() {
    }

    public Serials(String title, String description, Integer year, String country, String genre, String director, Integer time, String imgUrl) {
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
}