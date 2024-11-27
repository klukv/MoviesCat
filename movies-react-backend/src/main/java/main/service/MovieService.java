package main.service;

import main.models.Movies;
import main.repositories.MoviesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MovieService {

    @Autowired
    MoviesRepository moviesRepository;

    public boolean addMovie(Movies movie) throws Exception {
        if (moviesRepository.existsByTitle(movie.getTitle())) {
            return false;
        };

        // Сохраняем в базу данных
        moviesRepository.save(movie);
        return true;
    }
}
