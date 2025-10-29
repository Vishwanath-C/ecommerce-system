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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal lineTotal;

    @PrePersist
    @PreUpdate
    private void calculateLineTotal(){
        if(unitPrice != null && quantity != 0){
            this.lineTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }


}
