package main.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PageResponse<T> {
    List<T> content;
    Integer page;
    Integer size;
    Long totalElements;
    Integer totalPages;
    Boolean last;
}
