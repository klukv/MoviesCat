package com.admin.demo.controllers;

import com.admin.demo.models.Movie;
import com.admin.demo.pojo.MessageResponse;
import com.admin.demo.services.MoviesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MoviesController {
    @Autowired
    MoviesService moviesService;

    @PostMapping("/movie")
    public ResponseEntity<MessageResponse> createMovie(@RequestBody Movie newMovie) {
        return moviesService.addMovie(newMovie)
                ? ResponseEntity.ok(new MessageResponse("Фильм успешно добавлен!"))
                : ResponseEntity.badRequest().body(new MessageResponse("Данный фильм уже существует"));
    }

    @PutMapping("/movie")
    public ResponseEntity<MessageResponse> editMovie(@RequestBody Movie changedMovie) {
        return moviesService.changeMovie(changedMovie)
                ? ResponseEntity.ok(new MessageResponse("Изменения успешно сохранены!"))
                : ResponseEntity.badRequest().body(new MessageResponse("id фильма не должен быть пустым"));
    }

    @DeleteMapping("/movie")
    public ResponseEntity<MessageResponse> deleteMovie(@RequestParam("id") Long id) {
        return moviesService.removeMovie(id)
                ? ResponseEntity.ok(new MessageResponse("Фильм был удален!"))
                : ResponseEntity.badRequest().body(new MessageResponse("id фильма не указан"));
    }

    @GetMapping("/movies")
    public ResponseEntity<List<Movie>> getAllMovies() {
        return new ResponseEntity<>(moviesService.getAllMovies(), HttpStatus.OK);
    }
}
