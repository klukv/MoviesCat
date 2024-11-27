package main.controllers;

import main.Config.jwt.JwtUtils;
import main.models.ERole;
import main.models.Role;
import main.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import main.pojo.JwtResponse;
import main.pojo.LoginRequest;
import main.pojo.MessageResponse;
import main.pojo.SignupRequest;
import main.repositories.RoleRepository;
import main.repositories.UserRepository;
import main.service.UserDetailsImpl;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/login")
    public ResponseEntity<?> authUser(@RequestBody LoginRequest loginRequest){

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
                jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(), roles));


    }
    @PostMapping("/registration")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest registerReq){

        if (userRepository.existsByUsername(registerReq.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Данное имя пользователя занято"));
        }

        if (userRepository.existsByEmail(registerReq.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body(new MessageResponse("Пользователь с таким адресом уже существует"));
        }

        User user = new User(registerReq.getUsername(),
                registerReq.getEmail(),
                passwordEncoder.encode(registerReq.getPassword()));

        Set<String> reqRoles = registerReq.getRoles();
        Set<Role> roles = new HashSet<>();

        if (reqRoles == null) {
            Role userRole = roleRepository
                    .findByName(ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("Error, Role USER is not found"));
            roles.add(userRole);
        } else {
            reqRoles.forEach(r -> {
                switch (r) {
                    case "admin":
                        Role adminRole = roleRepository
                                .findByName(ERole.ROLE_ADMIN)
                                .orElseThrow(() -> new RuntimeException("Error, Role ADMIN is not found"));
                        roles.add(adminRole);

                        break;
                    case "mod":
                        Role modRole = roleRepository
                                .findByName(ERole.ROLE_MODERATOR)
                                .orElseThrow(() -> new RuntimeException("Error, Role MODERATOR is not found"));
                        roles.add(modRole);

                        break;

                    default:
                        Role userRole = roleRepository
                                .findByName(ERole.ROLE_USER)
                                .orElseThrow(() -> new RuntimeException("Error, Role USER is not found"));
                        roles.add(userRole);

                }
            });
        }
        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Вы успешно зарегистрировались!"));
    }
}
