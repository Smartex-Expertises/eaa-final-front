import React from "react";
import { Typewriter } from "react-simple-typewriter";
import LayoutStudent from "@/layouts/student/LayoutStudent";

export default function Dashboard() {
  return (
    <div>
      <p>
        <Typewriter
          words={["Bienvenue dans l'interface d'administration"]}
          loop={1}
          cursor
          cursorStyle="."
          typeSpeed={140}
          deleteSpeed={100}
          delaySpeed={2000}
        />
      </p>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page: React.ReactNode) {
  return <LayoutStudent>{page}</LayoutStudent>;
};
