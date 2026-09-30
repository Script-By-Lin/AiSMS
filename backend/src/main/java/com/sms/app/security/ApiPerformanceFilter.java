package com.sms.app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@Slf4j
public class ApiPerformanceFilter extends OncePerRequestFilter {

    private static final long SLOW_API_THRESHOLD_MS = 200;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String uri = request.getRequestURI();

        try {
            filterChain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            response.setHeader("X-Response-Time-Millis", String.valueOf(duration));

            if (duration > SLOW_API_THRESHOLD_MS) {
                log.warn("[SLOW API BOTTLENECK] {} {} - Status: {} - Execution Time: {}ms (Exceeds {}ms target SLA)",
                        method, uri, response.getStatus(), duration, SLOW_API_THRESHOLD_MS);
            } else {
                log.debug("[API TIMING] {} {} - Status: {} - Time: {}ms", method, uri, response.getStatus(), duration);
            }
        }
    }
}
