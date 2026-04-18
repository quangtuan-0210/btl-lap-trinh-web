package com.restaurant.config;

import com.restaurant.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority; // THÊM IMPORT NÀY
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections; // THÊM IMPORT NÀY

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Lấy thẻ từ ra xem
        final String authHeader = request.getHeader("Authorization");

        // Nếu không có thẻ hoặc thẻ không chuẩn -> Bơ đi, cho Spring Security tự lo (chắc chắn sẽ bị chặn)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Lấy đoạn mã đằng sau chữ "Bearer "
        final String token = authHeader.substring(7);
        try {
            // Giải mã thẻ lấy tên user
            Claims claims = jwtService.extractAllClaims(token);
            String username = claims.getSubject();

            // LẤY CHỨC VỤ (ROLE) TỪ THẺ RA
            String role = claims.get("role", String.class);

            // Nếu đúng thẻ thật, cấp quyền VIP cho đi vào
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Ép chức vụ thành chuẩn của Spring Security để nó hiểu
                java.util.List<SimpleGrantedAuthority> authorities =
                        Collections.singletonList(new SimpleGrantedAuthority(role));

                // Giao cả tên và chức vụ cho bảo vệ cầm
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, authorities
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // Thẻ giả hoặc hết hạn thì kệ nó
        }

        filterChain.doFilter(request, response);
    }
}