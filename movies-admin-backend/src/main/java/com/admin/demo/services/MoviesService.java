package com.admin.demo.services;

import com.admin.demo.models.Movie;
import com.admin.demo.producers.MovieProducer;
import com.admin.demo.repositories.MoviesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MoviesService {

    private final MovieProducer movieProducer;

    @Autowired
    public MoviesService(MovieProducer movieProducer) {
        this.movieProducer = movieProducer;
    }

    @Autowired
    MoviesRepository moviesRepository;

    public boolean addMovie(Movie movie) {
        if (moviesRepository.existsByTitle(movie.getTitle())) {
            return false;
        };

        // Отправляем объект фильма в топик кафки
        movieProducer.addMovieToBroker(movie.getTitle(), movie);
        return true;
    }

    public boolean changeMovie(Movie changedMovie) {
        if (changedMovie.getId() == null) {
            return false;
        }

        moviesRepository.save(changedMovie);
        return true;
    }

    public boolean removeMovie(Long removingMovieId) {
        if (removingMovieId == null) return false;
        moviesRepository.deleteById(removingMovieId);
        return true;
    }

    public List<Movie> getAllMovies() {
        return moviesRepository.findAll();
    }
}
