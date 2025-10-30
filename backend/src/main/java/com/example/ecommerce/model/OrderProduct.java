package com.example.ecommerce.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_product", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"order_id", "product_id"})
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderProduct
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    private Long productId;
    private String productName;
    private String productImageUrl;
    private BigDecimal unitPrice;
    private BigDecimal lineTotal;
    private int quantity;

    @PrePersist
    @PreUpdate
    private void calculateLineTotal(){
        if(unitPrice != null && quantity != 0){
            this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }


}
