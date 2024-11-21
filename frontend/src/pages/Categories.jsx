import React from 'react';
import {Link} from "react-router-dom";
import comedyImg from "../assets/comedy.png";
import businessImg from "../assets/business.jpg";
import educationImg from "../assets/education.png";
import hobbiesImg from "../assets/hobbies.png";
import governmentImg from "../assets/government.jpg";

const Categories = () => {
    const cat = [
        {
            name: "Comedy",
            color:"bg-purple-200",
            to: "/categories/Comedy",
            img: comedyImg,
        },
        {
            name: "Business",
            color:"bg-green-300",
            to: "/categories/Business",
            img: businessImg, 
        },
        {
            name: "Education",
            color:"bg-red-200",
            to: "/categories/Education",
            img: educationImg,
        },
        {
            name: "Hobbies",
            color:"bg-zinc-400",
            to: "/categories/Hobbies",
            img: hobbiesImg,
        },
        {
            name: "Government",
            color:"bg-indigo-200",
            to: "/categories/Government",
            img: governmentImg,
        },
    ];

  return (
    <div className="h-screen lg:h-[78vh] bg-green-100">
        <div className="px-4 lg:px-12 py-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cat.map((items,i)=>(
                <Link 
                to={items.to} 
                key={i} 
                className={`rounded px-8 py-4 text-xl font-semibold ${items.color} hover:scale-105 shadow-xl transition-all duration-300 relative h-[22vh] overflow-hidden`}>
                <div>{items.name}</div>
                <div className="w-[100%] flex items-center justify-end absolute -bottom-2 -right-2">
                    <img src={items.img} alt="category" className="rounded rotate-12 h-[15vh] md:h-[17vh] lg:h-[10]"/>
                </div>
                </Link>
            ))}
        </div>
    </div>
  );
};

export default Categories