package com.restaurant.repository;

import com.restaurant.entity.Ban;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BanRepository extends JpaRepository<Ban, Long> {
}