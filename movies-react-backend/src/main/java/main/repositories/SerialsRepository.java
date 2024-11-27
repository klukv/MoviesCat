package main.repositories;

import main.models.Serials;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SerialsRepository extends JpaRepository<Serials, Long> {
    Boolean existsByTitle(String title);
    List<Serials> findByTitleContaining(String title, Sort sort);
}
