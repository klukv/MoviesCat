import React from "react";
import Carousel from "better-react-carousel";
import uncharted from "../assets/img/banner/backImage.jpg";
import peopleX from "../assets/img/banner/x.jpg";
import joker from "../assets/img/banner/joker.jpg";
import inception from "../assets/img/banner/inception_back.jpg";

const CarouselHome: React.FC = () => {
  return (
    <div className="banner__carousel">
      <Carousel cols={1} rows={1} gap={0} hideArrow={true} loop autoplay={3500}>
        <Carousel.Item>
          <img width="100%" src={uncharted} alt="back" />
        </Carousel.Item>
        <Carousel.Item>
          <img width="100%" src={peopleX} alt="back" />
        </Carousel.Item>
        <Carousel.Item>
          <img width="100%" src={joker} alt="back" />
        </Carousel.Item>
        <Carousel.Item>
          <img width="100%" src={inception} alt="back" />
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default CarouselHome;
