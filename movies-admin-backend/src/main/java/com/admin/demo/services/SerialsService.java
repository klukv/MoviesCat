package com.admin.demo.services;

import com.admin.demo.models.Serial;
import com.admin.demo.repositories.SerialsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SerialsService {
    @Autowired
    SerialsRepository serialsRepository;

    public boolean addSerial(Serial serial) {
        if (serialsRepository.existsByTitle(serial.getTitle())) {
            return false;
        };

        serialsRepository.save(serial);
        return true;
    }

    public boolean changeSerial(Serial changedSerial) {
        if (changedSerial.getId() == null) {
            return false;
        }

        serialsRepository.save(changedSerial);
        return true;
    }

    public boolean removeSerial(Long removingSerialId) {
        if (removingSerialId == null) return false;
        serialsRepository.deleteById(removingSerialId);
        return true;
    }
}
