package com.phishguard.controller;

import com.phishguard.dto.AnalyzeRequest;
import com.phishguard.dto.AnalyzeResponse;
import com.phishguard.service.MlClientService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DetectionController {

    private final MlClientService mlClientService;

    @PostMapping("/detect")
    public AnalyzeResponse detectPhishing(@RequestBody AnalyzeRequest request) {
        return mlClientService.analyzeEmail(request);
    }
}