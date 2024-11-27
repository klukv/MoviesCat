package main.controllers;

import main.models.Serials;
import main.models.User;
import main.pojo.AddFavouriteRequest;
import main.pojo.MessageResponse;
import main.repositories.SerialsRepository;
import main.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class SerialsController {

    @Autowired
    SerialsRepository serialsRepository;
    @Autowired
    UserRepository userRepository;

    private Sort.Direction getSortDirection(String direction){
        if(direction.equals("asc")){
            return Sort.Direction.ASC;
        }else if(direction.equals("desc")){
            return Sort.Direction.DESC;
        }

        return Sort.Direction.ASC;
    }

    @PostMapping("/serial")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createSerial(@RequestBody Serials newSerial) {
        return addSerial(newSerial);
    }

    private ResponseEntity<?> addSerial(Serials serial) {
        if(serialsRepository.existsByTitle(serial.getTitle())){
            return ResponseEntity.badRequest().body(new MessageResponse("Данный сериал уже добавлен"));
        }
        serialsRepository.save(serial);
        return ResponseEntity.ok(new MessageResponse("Фильм был успешно добавлен!"));
    }

    @PutMapping("/serial")
    @PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> changeSerial(@RequestBody Serials changingSerial) {
        return editMovie(changingSerial);
    }

    private ResponseEntity<?> editMovie(Serials serial){
        if(serial.getId() == null){
            return ResponseEntity.badRequest().body(new MessageResponse("id фильма не должен быть пустым"));
        }

        serialsRepository.save(serial);
        return ResponseEntity.ok(new MessageResponse("Изменения успешно внесены!"));
    }

    @DeleteMapping("serial/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSerial(@PathVariable("id") Long id){
        return removeSerial(id);
    }

    private ResponseEntity<?> removeSerial(Long id){
        serialsRepository.deleteById(id);
        return ResponseEntity.ok(new MessageResponse("Злодей был ликвидирован!"));
    }

    @PostMapping("/addSerial")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createFavouriteSerial(@RequestBody AddFavouriteRequest favouriteRequest){
        return addFavouriteSerial(favouriteRequest);
    }

    private ResponseEntity<?> addFavouriteSerial(AddFavouriteRequest favouriteRequest){
        try{
            User user = userRepository.findById(favouriteRequest.getUser_id()).get();
            Serials findAddSerial = serialsRepository.findById(favouriteRequest.getSerial_id()).get();
            List<User> serialUsers = findAddSerial.getUsers();
            if(serialUsers.contains(user)){
                return ResponseEntity.badRequest().body(new MessageResponse("Данный сериал уже был добавлен"));
            }
            serialUsers.add(user);
            findAddSerial.setUsers(serialUsers);
            serialsRepository.save(findAddSerial);
            return ResponseEntity.ok(new MessageResponse("Сериал добавлен в любимые"));
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(new MessageResponse("Вас или данного сериала не существует"));
        }

    }
    @GetMapping("/all-favourite-serials")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public Set getFavouriteSerials(@RequestParam Long user_id){
        User user = userRepository.findById(user_id).get();
        return user.getFavouriteSerials();
    }

    //========СОРТИРОВКА И ФИЛЬТРАЦИЯ=============

    @GetMapping("/serials")
    @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Serials>> getAllSortedSerial(@RequestParam(defaultValue = "id,desc") String[] sort, @RequestParam(defaultValue = "default") String genre){

        try{
            List<Sort.Order> orders = new ArrayList<Sort.Order>();

            if (sort[0].contains(",")) {
                for (String sortOrder : sort) {
                    String[] _sort = sortOrder.split(",");
                    orders.add(new Sort.Order(getSortDirection(_sort[1]), _sort[0]));
                }
            } else {
                orders.add(new Sort.Order(getSortDirection(sort[1]), sort[0]));
            }
            List<Serials> serials = serialsRepository.findAll(Sort.by(orders));

            if(!genre.equals("default")){
                List<Serials> filterMovies = serials.stream()
                        .filter(movie -> Arrays.asList(movie.getGenre().replaceAll("\\s+","").split(",")).contains(genre))
                        .collect(Collectors.toList());

                return new ResponseEntity<>(filterMovies, HttpStatus.OK);
            }

            if (serials.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(serials, HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
