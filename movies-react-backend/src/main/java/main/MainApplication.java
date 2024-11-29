package main;

import main.consumers.MovieConsumer;
import main.repositories.Initialazer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class MainApplication {

	private static Initialazer initiator;

	private static MovieConsumer movieConsumer;

	@Autowired
	public void setInitialLoader(Initialazer initiator) {
		MainApplication.initiator = initiator;
	}

	@Autowired
	public void setMovieConsumer(MovieConsumer movieConsumer) {
		MainApplication.movieConsumer = movieConsumer;
	}


	public static void main(String[] args) {
		SpringApplication.run(MainApplication.class, args);
		//initiator.initial();
		movieConsumer.runConsumer();
	}

}
