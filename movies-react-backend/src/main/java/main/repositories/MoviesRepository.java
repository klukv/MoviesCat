package main.repositories;

import main.models.Movies;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MoviesRepository extends JpaRepository<Movies, Long> {
    Boolean existsByTitle(String title);
    List<Movies> findByTitleContaining(String title, Sort sort);
    List<Movies> findByType(String type);
}
