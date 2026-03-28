package main;

import main.service.movie.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {

    private static MovieService movieService;

	// private static MovieConsumer movieConsumer;

//	@Autowired
//	public void setMovieConsumer(MovieConsumer movieConsumer) {
//		MainApplication.movieConsumer = movieConsumer;
//	}

    @Autowired
    public void setMovieService(MovieService movieService) {
        MainApplication.movieService = movieService;
    }


	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
        if (movieService.isEmptyMovies()) movieService.uploadInitMoviesData();
		// movieConsumer.runConsumer();
	}

}
