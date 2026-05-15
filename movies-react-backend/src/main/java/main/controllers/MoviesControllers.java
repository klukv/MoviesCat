package main.controllers;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import main.dto.AddFavouriteRequest;
import main.dto.MessageResponse;
import main.dto.MovieDTO;
import main.dto.PageResponse;
import main.models.Movies;
import main.models.User;
import main.repositories.MoviesRepository;
import main.repositories.UserRepository;
import main.service.movie.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", maxAge = 3600)
@RequiredArgsConstructor
public class MoviesControllers {

    @Autowired
    MoviesRepository moviesRepository;
    @Autowired
    UserRepository userRepository;

    private final MovieService movieService;


    @PostMapping("/movie")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createMovie(@RequestBody Movies newMovie) {
        return addMovie(newMovie);
    }

    private ResponseEntity<?> addMovie(Movies movie) {
        if(moviesRepository.existsByTitle(movie.getTitle())){
            return ResponseEntity.badRequest().body(new MessageResponse("Данный фильм уже добавлен"));
        }
        moviesRepository.save(movie);
        return ResponseEntity.ok(new MessageResponse("Фильм был успешно добавлен!"));
    }

    @PutMapping("/movie")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> changeMovie(@RequestBody Movies changingMovie) {
       return editMovie(changingMovie);
    }

    private ResponseEntity<?> editMovie(Movies movie){
        if(movie.getId() == null){
            return ResponseEntity.badRequest().body(new MessageResponse("id фильма не должен быть пустым"));
        }

       moviesRepository.save(movie);
        return ResponseEntity.ok(new MessageResponse("Изменения успешно внесены!"));
    }

    @DeleteMapping("movie/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteMovie(@PathVariable("id") Long id){
        return removeMovie(id);
    }

    private ResponseEntity<?> removeMovie(Long id){
        moviesRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Злодей был ликвидирован!"));
    }

    @PostMapping("/addMovie")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createFavouriteMovie(@RequestBody AddFavouriteRequest favouriteRequest){
        return addFavouriteMovie(favouriteRequest);
    }

    private ResponseEntity<?> addFavouriteMovie(AddFavouriteRequest favouriteRequest){
        try{
            User user = userRepository.findById(favouriteRequest.getUser_id()).get();
            Movies findAddMovie = moviesRepository.findById(favouriteRequest.getMovie_id()).get();
            List<User> movieUsers = findAddMovie.getUsers();
            if(movieUsers.contains(user)){
                return ResponseEntity.badRequest().body(new MessageResponse("Данный фильм уже был добавлен"));
            }
            movieUsers.add(user);
            findAddMovie.setUsers(movieUsers);
            moviesRepository.save(findAddMovie);
            return ResponseEntity.ok(new MessageResponse("Фильм добавлен в любимые"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse("Вас или данного фильма не существует"));
        }

    }
    @GetMapping("/all-favourite-movies")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Set getFavouriteMovies(@RequestParam Long user_id){
            User user = userRepository.findById(user_id).get();
            return user.getFavouriteMovies();
    }

    //========СОРТИРОВКА И ФИЛЬТРАЦИЯ=============

    @GetMapping("/movies")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<PageResponse<Movies>> getAllSortedMovies(
            @RequestParam(defaultValue = "id,desc") String[] sort,
            @RequestParam(defaultValue = "default") String genre,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") @Max(100) Integer size
    ) {

        try {
            PageResponse<Movies> movies = movieService.getAllMovies(sort, genre, page, size);

            if (movies.getContent().isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(movies, HttpStatus.OK);
        } catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/type-movies")
    public ResponseEntity<List<Movies>> getTypeMovies(@RequestParam String type) {
        try{
            List<Movies> selectTypeMovies = moviesRepository.findByType(type);
            return new ResponseEntity<>(selectTypeMovies, HttpStatus.OK);
        }
        catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("users/{userId}/recommendations")
    public ResponseEntity<List<MovieDTO>> getRecommendations(
            @PathVariable String userId,
            @RequestParam(defaultValue = "20")
            @Min(value = 1)
            @Max(value = 100)
            int limit,
            @RequestParam(defaultValue = "homepage")
            String context,
            @RequestParam(required = false)
            String genre,
             @RequestParam(required = true)
            boolean excludeWatched
    ) {
        List<MovieDTO> movies = movieService.getRecommendedMovies(userId, limit, context, genre, excludeWatched);

        return ResponseEntity.ok(movies);
    }
}
