import React, { useRef, useState, useEffect } from "react";
import { TiLocationArrow } from "react-icons/ti";
import { Link, useLocation } from "react-router-dom";
import Button from "./Button";
import { useWindowScroll } from "react-use";
import gsap from "gsap";

const navItems = ["Hero", "About", "Story", "Contact"];

const Navbar = () => {
  const location = useLocation();
  const navContainerRef = useRef(null);
  const audioElementRef = useRef(null);
  const lastScrollYRef = useRef(0);

  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isIndicatorActive, setIndicatorActive] = useState(false);

  const { y: currentScrollY } = useWindowScroll();

  const toggleAudioIndicator = () => {
    setIsAudioPlaying((prev) => !prev);
    setIndicatorActive((prev) => !prev);
  };

  useEffect(() => {
    if (isAudioPlaying) {
      audioElementRef.current.play();
    } else {
      audioElementRef.current.pause();
    }
  }, [isAudioPlaying]);

  useEffect(() => {
    const lastScrollY = lastScrollYRef.current;

    if (currentScrollY === 0) {
      setIsNavVisible(true);
    } else if (currentScrollY > lastScrollY) {
      setIsNavVisible(false);
    } else if (currentScrollY < lastScrollY) {
      setIsNavVisible(true);
    }

    lastScrollYRef.current = currentScrollY;
  }, [currentScrollY]);

  useEffect(() => {
    gsap.to(navContainerRef.current, {
      y: isNavVisible ? 0 : -100,
      opacity: isNavVisible ? 1 : 0,
      duration: 0.5,
    });
  }, [isNavVisible]);

  const navClasses = `
    fixed inset-x-0 top-4 z-50 h-16 border-none 
    transition-all duration-500 sm:inset-x-6 
    ${currentScrollY > 0 && isNavVisible ? "bg-black rounded-2xl" : ""}
  `;

  // Function to determine the correct navigation link for each nav item
  const getNavLink = (item) => {
    const itemLower = item.toLowerCase();

    // If we're not on the homepage, we need to navigate to the homepage first
    if (location.pathname !== "/") {
      return `/${itemLower === "hero" ? "" : `#${itemLower}`}`;
    }

    // If we're already on the homepage, we can just use anchors
    return `#${itemLower}`;
  };

  return (
    <div ref={navContainerRef} className={navClasses}>
      <header className="absolute top-1/2 w-full -translate-y-1/2">
        <nav className="flex size-full items-center justify-between p-4">
          <div className="flex items-center gap-7">
            <Link to="/">
              <img src="/img/logo.png" alt="logo" className="w-10" />
            </Link>

            <Button
              id="products-button"
              title="Products"
              href="https://living.ai/play-with-emo/"
              target="_blank"
              rightIcon={<TiLocationArrow />}
              containerClass="bg-blue-50 md:flex hidden items-center justify-center gap-1"
            />
          </div>

          <div className="flex h-full items-center">
            <div className="hidden md:block">
              {navItems.map((item) => (
                <Link
                  key={item}
                  to={getNavLink(item)}
                  className="nav-hover-btn"
                >
                  {item}
                </Link>
              ))}
            </div>

            <button
              className="ml-10 flex items-center space-x-0.5"
              onClick={toggleAudioIndicator}
            >
              <audio
                ref={audioElementRef}
                className="hidden"
                src="/audio/loop.mp3"
                loop
              />
              {[1, 2, 3, 4].map((bar) => (
                <div
                  key={bar}
                  className={`indicator-line ${
                    isIndicatorActive ? "active" : ""
                  }`}
                  style={{ animationDelay: `${bar * 0.1}s` }}
                />
              ))}
            </button>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
