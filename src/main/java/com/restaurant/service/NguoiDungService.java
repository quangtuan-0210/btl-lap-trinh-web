package com.restaurant.service;

import com.restaurant.entity.NguoiDung;
import com.restaurant.entity.Role;
import com.restaurant.repository.NguoiDungRepository;
import com.restaurant.exception.AppException;
import com.restaurant.exception.ErrorCode;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.restaurant.dto.response.NguoiDungResponse;
import com.restaurant.dto.request.NguoiDungRequest;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Optional;

@Service
public class NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    private NguoiDungResponse mapToResponse(NguoiDung user) {
        return NguoiDungResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public List<NguoiDungResponse> getAllUsers() {
        return nguoiDungRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public NguoiDungResponse createUser(NguoiDungRequest request) {
        if (nguoiDungRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        NguoiDung user = new NguoiDung();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setEmail(request.getEmail());
        user.setRole(Role.valueOf(request.getRole()));

        user = nguoiDungRepository.save(user);
        return mapToResponse(user);
    }

    public void deleteUser(Long id) {

        if (!nguoiDungRepository.existsById(id)) {
            throw new AppException(ErrorCode.USER_NOT_EXISTED);
        }
        nguoiDungRepository.deleteById(id);
    }

    public NguoiDungResponse updateUser(Long id, NguoiDungRequest request) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED)); //
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        user.setRole(Role.valueOf(request.getRole()));

        user = nguoiDungRepository.save(user);
        return mapToResponse(user);
    }

    public NguoiDung checkLogin(String username, String password) {
        NguoiDung user = nguoiDungRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

        // NẾU MẬT KHẨU ĐÃ ĐƯỢC MÃ HÓA (Bắt đầu bằng $2a$)
        if (user.getPassword().startsWith("$2a$")) {
            if (!passwordEncoder.matches(password, user.getPassword())) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
        }
        // NẾU MẬT KHẨU VẪN LÀ CHỮ THUẦN
        else {
            if (!user.getPassword().equals(password)) {
                throw new AppException(ErrorCode.UNAUTHENTICATED);
            }
            // Tự động mã hóa mật khẩu và lưu đè lại vào DB
            user.setPassword(passwordEncoder.encode(password));
            nguoiDungRepository.save(user);
        }

        return user;
    }

    public NguoiDung getById(Long id) {
        return nguoiDungRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }
}