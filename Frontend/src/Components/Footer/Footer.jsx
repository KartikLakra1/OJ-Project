import React, { useEffect, useState } from "react";

const Footer = () => {
  const [hour, setHour] = useState(new Date().getHours());
  const [min, setMin] = useState(new Date().getMinutes());
  const [sec, setSec] = useState(new Date().getSeconds());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setHour(now.getHours());
      setMin(now.getMinutes());
      setSec(now.getSeconds());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="w-full border-t py-6 px-4 text-center text-lg bg-gradient-to-r from-gray-950 to-gray-800 text-white">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
        <p>© {new Date().getFullYear()} Code Gunie. All rights reserved.</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/KartikLakra1"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/kartiklakra21/"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
        </div>

        <div>
          {hour.toString().padStart(2, "0")}:{min.toString().padStart(2, "0")}:
          {sec.toString().padStart(2, "0")}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
