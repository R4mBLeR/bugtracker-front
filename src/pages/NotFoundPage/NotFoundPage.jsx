import React from "react";
import "./NotFoundPage.css";
import useTitle from "../../hooks/useTitle";

const NotFoundPage = () => {

    useTitle('Not Found');

    return <div>
      <div className="not-founded">Page Not Found</div>
  </div>;
};

export default NotFoundPage;
