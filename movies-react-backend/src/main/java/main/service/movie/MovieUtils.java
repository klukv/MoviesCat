package main.service.movie;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
public class MovieUtils {
    private static final ObjectMapper OBJECT_MAPPER;

    static {
        JsonFactory factory = new JsonFactory();
        factory.enable(JsonParser.Feature.ALLOW_SINGLE_QUOTES);
        factory.enable(JsonParser.Feature.ALLOW_UNQUOTED_FIELD_NAMES);
        OBJECT_MAPPER = new ObjectMapper(factory);
    }

    public static String extractDirector(String crewJson) {
        if (crewJson == null || crewJson.isEmpty() || "None".equals(crewJson)) {
            return null;
        }

        try {
            // Пытаемся исправить распространенные проблемы
            String cleanedJson = crewJson
                    .replace("'", "\"")                    // одинарные на двойные кавычки
                    .replace("None", "null")               // None в null
                    .replaceAll("(\\w+):", "\"$1\":")     // ключи без кавычек
                    .replace("\\\"", "\"");                // исправляем экранирование

            JsonNode root = OBJECT_MAPPER.readTree(cleanedJson);

            for (JsonNode crew : root) {
                if (crew.has("job") && "Director".equals(crew.get("job").asText())) {
                    return crew.get("name").asText();
                }
            }
        } catch (JsonProcessingException e) {
            // Логируем проблемную строку для отладки
            log.debug("Ошибка парсинга crew: {}", crewJson.substring(0, Math.min(crewJson.length(), 200)));
            return null;
        }
        return null;
    }
    
    public static Integer extractYear(String releaseDate) {
        if (releaseDate == null || releaseDate.isEmpty()) return null;
        try {
            return Integer.parseInt(releaseDate.split("-")[0]);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static String extractCountry(String countriesJson) {
        if (countriesJson == null || countriesJson.isEmpty() || "None".equals(countriesJson)) {
            return null;
        }

        try {
            JsonNode root = OBJECT_MAPPER.readTree(countriesJson);
            if (!root.isEmpty()) {
                return root.get(0).get("name").asText();
            }
        } catch (Exception e) {
            log.debug("Ошибка парсинга страны: {}", countriesJson);
        }
        return null;
    }

    public static String extractGenres(String genresJson) {
        try {
            JsonNode root = OBJECT_MAPPER.readTree(genresJson);
            List<String> genreNames = new ArrayList<>();

            for (JsonNode genre : root) {
                genreNames.add(genre.get("name").asText());
            }

            return String.join(", ", genreNames);
        } catch (Exception e) {
            return null;
        }
    }

    public static String buildImgUrl(String posterPath) {
        if (posterPath == null || posterPath.isEmpty()) return null;
        return "https://image.tmdb.org/t/p/w500" + posterPath;
    }

    public static Integer parseIntOrNull(String value) {
        if (value == null || value.isEmpty()) return null;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static Float parseFloatOrNull(String value) {
        if (value == null || value.isEmpty()) return 0.0f;

        try {
            return Float.parseFloat(value);
        } catch (NumberFormatException e) {
            return 0.0f;
        }
    }

    public static String getColumn(String[] row, int idx) {
        return row.length > idx ? row[idx] : null;
    }
}
