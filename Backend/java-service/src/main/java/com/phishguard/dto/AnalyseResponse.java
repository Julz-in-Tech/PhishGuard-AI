package com.phishguard.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AnalyzeResponse {
    private int score;
    private String verdict;
    private String badgeColor;
    private List<String> flags;
}