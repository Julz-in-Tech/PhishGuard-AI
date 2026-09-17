package com.phishguard.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalyzeResponse {
    private int score;
    private String verdict;
    private String badgeColor;
    private List<String> flags;
}