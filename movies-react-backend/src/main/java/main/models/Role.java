package main.models;

import javax.persistence.*;

@Entity
@Table(name="roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ERole name;

    public Role() {}

    public Role(ERole nameRole) {
        this.name = nameRole;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setNameRole(ERole nameRole) {
        this.name = nameRole;
    }

    public Long getId() {
        return id;
    }

    public ERole getNameRole() {
        return name;
    }
}
