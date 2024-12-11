package com.admin.demo.producers;

import com.admin.demo.models.Movie;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Properties;

@Service
public class MovieProducer {
    private final static String TOPIC_MOVIE = "movie-topic";

    @Value("${spring.kafka.producer.bootstrap-servers}")
    private String bootstrapServers;

    private Producer<String, String> createProducer() {
        Properties properties = new Properties();

        properties.setProperty(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        properties.setProperty(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        properties.setProperty(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        return new KafkaProducer<String, String>(properties);
    }

    public void addMovieToBroker(String key, Movie movie) {
        final Producer<String, String> movieProducer = createProducer();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            final ProducerRecord<String, String> movieRecord = new ProducerRecord<>(TOPIC_MOVIE, key, objectMapper.writeValueAsString(movie));
            RecordMetadata metadata = movieProducer.send(movieRecord).get();

            System.out.printf("metadata: ", metadata);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            movieProducer.flush();
            movieProducer.close();
        }
    }
}
