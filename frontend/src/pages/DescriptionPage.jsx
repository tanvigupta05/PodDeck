import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DescriptionPage = () => {
  const { id } = useParams();
  const [Podcasts, setPodcasts] = useState();

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/get-podcast/${id}`,
        { withCredentials: true }
      );
      setPodcasts(res.data.data);
    };
    fetch();
  }, [id]);

  return (
    <div className="bg-zinc-900 h-screen text-zinc-50 px-4 lg:px-12 py-4 h-auto flex flex-col md:flex-row items-start justify-between gap-4">
      {Podcasts && (
        <>
          <div className="w-full md:w-2/6 flex items-center justify-center md:justify-start md:items-start">
            <img
              src={`http://localhost:3000/${Podcasts.frontImage}`}
              alt="/"
              className="rounded w-full h-[50vh] object-cover"
            />
          </div>
          <div className="w-full md:w-4/6 flex flex-col justify-between">
            <div className="text-4xl font-semibold text-zinc-100">{Podcasts.title}</div>
            <h4 className="mt-4 text-zinc-300 overflow-auto max-h-[60vh]">
              {Podcasts.description}
            </h4>
            <div className="mt-2 w-fit bg-zinc-600 text-zinc-200 border border-zinc-500 rounded-full px-4 py-2 text-center">
              {Podcasts.category.categoryName}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DescriptionPage;