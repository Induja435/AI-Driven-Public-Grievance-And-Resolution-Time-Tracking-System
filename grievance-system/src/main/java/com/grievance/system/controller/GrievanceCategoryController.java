package com.grievance.system.controller;

import com.grievance.system.model.GrievanceCategory;
import com.grievance.system.repository.GrievanceCategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "*")
public class GrievanceCategoryController {

    private final GrievanceCategoryRepository categoryRepository;

    public GrievanceCategoryController(GrievanceCategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // GET all categories
    @GetMapping
    public List<GrievanceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    // POST new category
    @PostMapping
    public GrievanceCategory createCategory(@RequestBody GrievanceCategory category) {
        return categoryRepository.save(category);
    }
}


