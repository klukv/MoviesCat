package main.service.movie;

import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.client.RecommendationClient;
import main.dto.MovieDTO;
import main.dto.MovieScore;
import main.dto.RecommendationResponse;
import main.models.Movies;
import main.repositories.MoviesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
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

    public Boolean isEmptyMovies() {
        return moviesRepository.count() == 0;
    }

    public List<MovieDTO> getRecommendedMovies(
            String userId, int limit, String context,
            String genre, boolean excludeWatched) {
        RecommendationResponse recResponse = recommendationClient.getRecommendations(userId, limit, context, genre, excludeWatched);

        List<Long> movieIds = recResponse.getRecommendations()
                .stream()
                .map(MovieScore::getMovieId)
                .collect(Collectors.toList());

        List<MovieDTO> movies = moviesRepository.findAllByIdIn(movieIds)
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

    public void uploadInitMoviesData() {
        ArrayList<Movies>  movies = this.mappingCSVDataToMovies();
        this.moviesRepository.saveAll(movies);
    }

    private ArrayList<Movies> mappingCSVDataToMovies() {
        ArrayList<String[]> credits = this.readCsvFile("credits.csv");
        ArrayList<String[]> moviesMetadata = this.readCsvFile("movies_metadata.csv");

        Map<String, String> directorMap = this.buildDirectorIndex(credits);
        return this.parseRawData(moviesMetadata, directorMap);
    }

    private ArrayList<String[]> readCsvFile(String path) {
        try (
                CSVReader reader = new CSVReaderBuilder(this.readFileFromResource(path))
                .withCSVParser(new CSVParserBuilder()
                        .withSeparator(',')
                        .withQuoteChar('"')
                        .build())
                .build()
        ) {

            ArrayList<String[]> rows = new ArrayList<String[]>();
            String[] line;

            while ((line = reader.readNext()) != null) {
                Collections.addAll(rows, line);
            }

            return rows;
        } catch (CsvValidationException | IOException e) {
            log.error("Ошибка при чтении CSV файла: {}", path, e);
            throw new RuntimeException(e);
        }
    }

    private BufferedReader readFileFromResource(String path) throws IOException {
        InputStream is = getClass().getResourceAsStream("/" + path);

        if (is == null) {
            throw new IllegalArgumentException("Файл не найден в resources " + path);
        }

        return new BufferedReader(new InputStreamReader(is, StandardCharsets.UTF_8));
    }

    private Map<String, String> buildDirectorIndex(ArrayList<String[]> credits) {
        Map<String, String> directorMap = new HashMap<>();

        for (int i = 0; i < credits.size(); i++) {
            String[] row = credits.get(i);

            String movieId = row[2];
            String crewJSON = row[1];

            String director = MovieUtils.extractDirector(crewJSON);
            if (director != null) directorMap.put(movieId, director);
        }
        return directorMap;
    }

    private ArrayList<Movies> parseRawData(ArrayList<String[]> data, Map<String, String> directorMap) {
        ArrayList<Movies> movies = new ArrayList<>();

        for (int i = 1; i < data.size(); i++) {
            String[] row = data.get(i);
            String director = directorMap.get(row[5]);

            movies.add(this.parseLine(row, director));
        }
        return movies;
    }

    private Movies parseLine(String[] row, String director) {
        Movies movie = new  Movies();

        movie.setTitle(MovieUtils.getColumn(row, 20));
        movie.setDescription(MovieUtils.getColumn(row, 9));
        movie.setYear(MovieUtils.extractYear(MovieUtils.getColumn(row, 14)));
        movie.setCountry(MovieUtils.extractCountry(MovieUtils.getColumn(row, 13)));
        movie.setGenre(MovieUtils.extractGenres(MovieUtils.getColumn(row, 3)));
        movie.setDirector(director);
        movie.setTime(MovieUtils.parseFloatOrNull(MovieUtils.getColumn(row, 16)));
        movie.setBudget(MovieUtils.parseIntOrNull(MovieUtils.getColumn(row, 2)));
        movie.setImgUrl(MovieUtils.buildImgUrl(MovieUtils.getColumn(row, 11)));
        movie.setType(null);
        movie.setRating(MovieUtils.parseFloatOrNull(MovieUtils.getColumn(row, 22)));

        return movie;
    }
}
