import React from "react";
import ContentLoader from "react-content-loader";

const MovieLoadingComponent: React.FC = () => {
  return (
    <ContentLoader
      speed={2}
      width={223}
      height={412}
      viewBox="0 0 223 412"
      backgroundColor="#303030"
      foregroundColor="#ecebeb"
    >
      <rect x="0" y="0" rx="14" ry="14" width="217" height="401" />
    </ContentLoader>
  );
};

export default MovieLoadingComponent;
