package com.admin.demo.repositories;

import com.admin.demo.models.Serial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SerialsRepository extends JpaRepository<Serial, Long> {
    Boolean existsByTitle(String title);
}
