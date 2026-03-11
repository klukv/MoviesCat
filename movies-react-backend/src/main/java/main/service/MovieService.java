package main.service;

import lombok.RequiredArgsConstructor;
import main.client.RecommendationClient;
import main.dto.MovieDTO;
import main.dto.MovieScore;
import main.dto.RecommendationResponse;
import main.models.Movies;
import main.repositories.MoviesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MovieService {

    @Autowired
    MoviesRepository moviesRepository;

    private final RecommendationClient recommendationClient;

    public boolean addMovie(Movies movie) throws Exception {
        if (moviesRepository.existsByTitle(movie.getTitle())) {
            return false;
        };

        // Сохраняем в базу данных
        moviesRepository.save(movie);
        return true;
    }

    public List<MovieDTO> getRecommendedMovies(
            String userId, int limit, String context,
            String genre, boolean excludeWatched) {
        RecommendationResponse recResponse = recommendationClient.getRecommendations(userId, limit, context, genre, excludeWatched);

        List<Long> movieIds = recResponse.getRecommendations()
                .stream()
                .map(MovieScore::getMovieId)
                .collect(Collectors.toList());

        List<MovieDTO> movies = moviesRepository.findAllById(movieIds)
                .stream()
                .map(entity -> MovieDTO.builder()
                        .id(entity.getId())
                        .title(entity.getTitle())
                        .description(entity.getDescription())
                        .year(entity.getYear())
                        .country(entity.getCountry())
                        .genre(entity.getGenre())
                        .director(entity.getDirector())
                        .time(entity.getTime())
                        .budget(entity.getBudget())
                        .imgUrl(entity.getImgUrl())
                        .type(entity.getType())
                        .score(0.0)  // score здесь заглушка — проставим отдельно из scoreMap
                        .build())
                .collect(Collectors.toList());

        Map<Long, Double> scoreMap = recResponse.getRecommendations()
                .stream()
                .collect(Collectors.toMap(MovieScore::getMovieId, MovieScore::getScore));

        movies.forEach(movie -> {
            movie.setScore(scoreMap.getOrDefault(movie.getId(), 0.0));
        });

        movies.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        return movies;
    }
}
