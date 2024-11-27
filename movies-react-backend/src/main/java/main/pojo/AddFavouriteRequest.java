package main.pojo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddFavouriteRequest {
    private Long user_id;
    private Long movie_id;
    private Long serial_id;
}
