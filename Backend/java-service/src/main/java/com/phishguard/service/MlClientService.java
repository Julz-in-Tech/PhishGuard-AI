package com.phishguard.service;

import com.phishguard.dto.AnalyzeRequest;
import com.phishguard.dto.AnalyzeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class MlClientService {

    private final RestClient restClient;

    public MlClientService(@Value("${python.ml.service.url:http://python-ml-service:8000}") String pythonServiceUrl) {
        this.restClient = RestClient.builder()
                .baseUrl(pythonServiceUrl)
                .build();
    }

    public AnalyzeResponse analyzeEmail(AnalyzeRequest request) {
        return restClient.post()
                .uri("/api/v1/analyze")
                .body(request)
                .retrieve()
                .body(AnalyzeResponse.class);
    }
}