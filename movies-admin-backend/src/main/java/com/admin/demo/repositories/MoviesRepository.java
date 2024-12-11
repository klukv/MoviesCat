package com.admin.demo.repositories;

import com.admin.demo.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MoviesRepository extends JpaRepository<Movie, Long> {
    Boolean existsByTitle(String title);
}
