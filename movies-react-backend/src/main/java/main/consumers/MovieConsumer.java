package main.consumers;

import com.fasterxml.jackson.databind.ObjectMapper;
import main.models.Movies;
import main.repositories.MoviesRepository;
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Collections;
import java.util.Properties;

@Service
public class MovieConsumer {

    private final static String TOPIC_MOVIE = "movie-topic";

    @Autowired
    private MoviesRepository moviesRepository;

    @Value("${spring.kafka.consumer.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String consumerGroupId;

    private Consumer<String, String> createConsumer() {
        Properties properties = new Properties();

        properties.setProperty(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.setProperty(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());
        properties.setProperty(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class.getName());

        properties.setProperty(ConsumerConfig.GROUP_ID_CONFIG, consumerGroupId);
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
