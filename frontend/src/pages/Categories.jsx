import React from "react";
import { Link } from "react-router-dom";
import comedyImg from "../assets/comedy.png";
import businessImg from "../assets/business.jpg";
import educationImg from "../assets/education.png";
import hobbiesImg from "../assets/hobbies.png";
import governmentImg from "../assets/government.jpg";
import otherImg from "../assets/others.jpg";
import historyImg from "../assets/history.png";
import { motion } from "framer-motion";

const Categories = () => {
  const cat = [
    {
      name: "Comedy",
      color: "bg-zinc-600",  
      to: "/categories/Comedy",
      img: comedyImg,
    },
    {
      name: "Business",
      color: "bg-zinc-600",  
      to: "/categories/Business",
      img: businessImg,
    },
    {
      name: "Education",
      color: "bg-zinc-600",  
      to: "/categories/Education",
      img: educationImg,
    },
    {
      name: "Hobbies",
      color: "bg-zinc-600",  
      to: "/categories/Hobbies",
      img: hobbiesImg,
    },
    {
      name: "Government",
      color: "bg-zinc-600",  
      to: "/categories/Government",
      img: governmentImg,
    },
    {
      name: "Historic",
      color: "bg-zinc-600",  
      to: "/categories/Historic",
      img: historyImg,
    },
    {
      name: "Others",
      color: "bg-zinc-600",  
      to: "/categories/Others",
      img: otherImg,
    },
  ];

  return (
    <div className="bg-zinc-900 min-h-screen px-4 lg:px-12 py-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cat.map((items, i) => (
          <motion.div
            key={i}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.2)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`rounded-lg ${items.color} shadow-lg p-6 text-xl font-semibold text-zinc-50 relative overflow-hidden h-[22vh] group`}
          >
            <Link to={items.to} className="block w-full h-full">
              <div className="z-10">{items.name}</div>
              <motion.div
                className="absolute bottom-0 right-0 w-[50%] flex items-center justify-end"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src={items.img}
                  alt="category"
                  className="rounded rotate-12 h-[15vh] md:h-[17vh] lg:h-[10] transition-transform duration-300"
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Categories;