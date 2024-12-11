package com.admin.demo.controllers;

import com.admin.demo.models.Serial;
import com.admin.demo.pojo.MessageResponse;
import com.admin.demo.services.SerialsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SerialsController {

    @Autowired
    SerialsService serialsService;

    @PostMapping("/serial")
    public ResponseEntity<String> createSerial(@RequestBody Serial newSerial) {
        return serialsService.addSerial(newSerial)
                ? ResponseEntity.ok("Сериал успешно добавлен!")
                : ResponseEntity.badRequest().body("Данный сериал уже существует");
    }

    @PutMapping("/serial")
    public ResponseEntity<MessageResponse> editSerial(@RequestBody Serial changingSerial) {
        return serialsService.changeSerial(changingSerial)
                ? ResponseEntity.ok(new MessageResponse("Изменения успешно сохранены!"))
                : ResponseEntity.badRequest().body(new MessageResponse("id сериала не должен быть пустым"));
    }

    @DeleteMapping("/serial")
    public ResponseEntity<MessageResponse> deleteSerial(@RequestBody Long removeSerialId) {
        return serialsService.removeSerial(removeSerialId)
                ? ResponseEntity.ok(new MessageResponse("Сериал был удален!"))
                : ResponseEntity.badRequest().body(new MessageResponse("id сериала не указан"));
    }
}
