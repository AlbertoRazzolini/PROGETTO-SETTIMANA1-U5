package com.example.progettosettimana1u5.controllers;

import com.example.progettosettimana1u5.payloads.post.NewPostDTO;
import com.example.progettosettimana1u5.payloads.post.PostRespDTO;
import com.example.progettosettimana1u5.payloads.post.UpdatePostDTO;
import com.example.progettosettimana1u5.services.PostService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
public class PostsController {

    private final PostService postService;

    public PostsController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PostRespDTO create(@RequestBody @Valid NewPostDTO body) {
        return postService.create(body);
    }

    @GetMapping
    public List<PostRespDTO> getAll() {
        return postService.getAll();
    }

    @GetMapping("/{postId}")
    public PostRespDTO getById(@PathVariable UUID postId) {
        return postService.getById(postId);
    }

    @PatchMapping("/{postId}")
    public PostRespDTO update(@PathVariable UUID postId, @RequestBody UpdatePostDTO body) {
        return postService.update(postId, body);
    }

    @DeleteMapping("/{postId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID postId) {
        postService.delete(postId);
    }
}
