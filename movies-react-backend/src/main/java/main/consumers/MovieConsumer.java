package main.consumers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import main.models.Movies;
import main.repositories.MoviesRepository;
import main.service.MovieService;
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.LongDeserializer;
import org.apache.kafka.common.serialization.LongSerializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

@Service
public class MovieConsumer {

    @Autowired
    MovieService movieService;

    private final static String TOPIC_MOVIE = "movie-topic";

    private final static String BOOTSTRAP_SERVERS = "localhost:9092";

    @Autowired
    private MoviesRepository moviesRepository;

    private static Consumer<String, String> createConsumer() {
        Properties properties = new Properties();

        properties.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP_SERVERS);
        properties.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        properties.setProperty(ConsumerConfig.GROUP_ID_CONFIG, "movies-consumer-group");
        properties.setProperty(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");

        final KafkaConsumer<String, String> movieConsumer = new KafkaConsumer<>(properties);

        movieConsumer.subscribe(Collections.singletonList(TOPIC_MOVIE));
        return movieConsumer;
    }

    public void runConsumer() {
        final Consumer<String, String> movieConsumer = createConsumer();
        try {
            while (true) {
                final ConsumerRecords<String, String> movieRecords = movieConsumer.poll(Duration.ofMillis(500));

                if (!movieRecords.isEmpty()) {
                    ObjectMapper objectMapper = new ObjectMapper();

                    for (ConsumerRecord<String, String> movieRecord : movieRecords) {
                        Movies movie = objectMapper.readValue(movieRecord.value(), Movies.class);
                        moviesRepository.save(movie);
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            movieConsumer.close();
        }
    }
}
