package com.grievance.system.controller;

import com.grievance.system.model.User;
import com.grievance.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by ID
    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    //pagination version
    @GetMapping("/paginated")
    public Page<User> getUsersPaginated(Pageable pageable) {
        return userService.getAllUsersPaginated(pageable);
    }

    // Create a new user
    @PostMapping
    public User createUser(@RequestBody User user) {

        // ✅ DEBUG LINE (ADD THIS)
        System.out.println("Received user: " + user);

        return userService.registerUser(user);
    }
}

