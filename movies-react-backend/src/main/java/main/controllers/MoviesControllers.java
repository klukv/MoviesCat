package main.controllers;

import lombok.extern.slf4j.Slf4j;
import main.models.Movies;
import main.models.User;
import main.pojo.AddFavouriteRequest;
import main.pojo.MessageResponse;
import main.repositories.MoviesRepository;
import main.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MoviesControllers {

    @Autowired
    MoviesRepository moviesRepository;
    @Autowired
    UserRepository userRepository;

    private Sort.Direction getSortDirection(String direction){
        if(direction.equals("asc")){
            return Sort.Direction.ASC;
        }else if(direction.equals("desc")){
            return Sort.Direction.DESC;
        }

        return Sort.Direction.ASC;
    }


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
    public ResponseEntity<List<Movies>> getAllSortedMovies(@RequestParam(defaultValue = "id,desc") String[] sort, @RequestParam(defaultValue = "default") String genre){

        try{
            List<Sort.Order> orders = new ArrayList<Sort.Order>();

            if (sort[0].contains(",")) {
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
                }
            } else {
                orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
            }
            List<Movies> movies = moviesRepository.findAll(Sort.by(orders));

            if(!genre.equals("default")){
                List<Movies> filterMovies = movies.stream()
                        .filter(movie -> Arrays.asList(movie.getGenre().replaceAll("\\s+","").split(",")).contains(genre))
                        .collect(Collectors.toList());

                return new ResponseEntity<>(filterMovies, HttpStatus.OK);
            }

            if (movies.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(movies, HttpStatus.OK);
        }catch (Exception e){
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

}
