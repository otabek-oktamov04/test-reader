import useLocalStorageState from "use-local-storage-state";

import { useEffect, useRef, useState } from "react";
import type { Contents, NavItem, Rendition } from "epubjs";
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from "react-reader";
import './App.css'

function updateTheme(rendition: Rendition, theme: string) {
  const themes = rendition.themes;
  switch (theme) {
    case "dark": {
      themes.override("color", "#fff");
      themes.override("background", "#000");
      break;
    }
    case "light": {
      themes.override("color", "#000");
      themes.override("background", "#fff");
      break;
    }
    case "green": {
      themes.override("color", "#000");
      themes.override("background", "#ceeaba");
      break;
    }
    case "pink": {
      themes.override("color", "#000");
      themes.override("background", "#f8f2e5");
      break;
    }
    case "midDark": {
      themes.override("color", "#fff");
      themes.override("background", "#48484a");
      break;
    }
  }
}

function updateFontFamily(rendition: Rendition, font: string) {
  const themes = rendition.themes;
  switch (font) {
    case "'Arvo', serif": {
      themes.override("font-family", "'Arvo', serif");
      themes.override("font-style", "italic");
      themes.override("font-weight", "500");
      break;
    }
    case "'Roboto', sans-serif": {
      themes.override("font-family", "'Roboto', sans-serif");
      themes.override("font-style", "italic");
      themes.override("font-weight", "600");
      break;
    }
    case "'Literata', serif": {
      themes.override("font-family", "'Literata', serif");
      themes.override("font-style", "normal");
      themes.override("font-weight", "500");
      break;
    }
    case "'Onest', sans-serif": {
      themes.override("font-family", "'Onest', sans-serif");
      themes.override("font-style", "normal");
      themes.override("font-weight", "500");
      break;
    }
  }
}

export const App = () => {
  const toc = useRef<NavItem[]>([]);
  const [page, setPage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const rendition = useRef<Rendition | undefined>(undefined);
  const [fontSize, setFontSize] = useState(100);
  const [mode, setMode] = useState("scrolled");
  const [fontFamily, setFontFamily] = useState("'Arvo', serif");
  const [epubUrl, setEpubUrl] = useState("");
  const [selectedStyles, setSelectedStyles] = useState({
    font1: true,
    font2: false,
  });
  const [theme, setTheme] = useState("light");
  const [show, setShow] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlLink = urlParams.get("url");
    if (urlLink) {
      setEpubUrl(urlLink);
    }
  }, []);

  const [location, setLocation] = useLocalStorageState<string | number>(
    "persist-location",
    {
      defaultValue: 0,
    }
  );

  useEffect(() => {
    const localFont = localStorage.getItem("fontFamily");
    setTimeout(() => {
      if (rendition.current && localFont) {
        updateFontFamily(rendition.current, localFont || "");
        rendition.current.display(location.toString());
      }
    }, 500);
  }, [rendition.current]);

  useEffect(() => {
    const localMode = localStorage.getItem("mode");
    if (localMode) {
      setMode(localMode);
    }
  }, []);

  useEffect(() => {
    const locTheme = localStorage.getItem("theme");
    if (locTheme) {
      setTheme(locTheme || "light");
    }
    setTimeout(() => {
      if (
        (locTheme === "dark" || locTheme === "midDark") &&
        rendition.current
      ) {
        rendition.current.themes.override("color", "#fff");
      }
    }, 500);
  }, [rendition.current]);

  useEffect(() => {
    if (rendition.current) {
      updateTheme(rendition.current, theme);
    }
  }, [theme]);

  useEffect(() => {
    if (rendition.current) {
      updateFontFamily(rendition.current, fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    rendition.current?.themes.fontSize(`${fontSize}%`);
  }, [fontSize]);

  const lightReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#fff",
      transform:'scaleX(1.3)',
    },
    prev: {
      display: "none",
    },
    next: {
      display: "none",
    },
    containerExpanded: {
      transform: "translateX(-100vw)",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      left: "none",
      right: "11%",
      position: "fixed",
      zIndex: 999,
    },
    tocButtonBarTop: {
      ...ReactReaderStyle.tocButtonBarTop,
      background: "#4D5250",
      height: "2px",
    },
    tocButtonBottom: {
      ...ReactReaderStyle.tocButtonBottom,
      background: "#4D5250",
      height: "3px",
    },

    tocArea: {
      ...ReactReaderStyle.tocArea,
      left: "none",
      right: "0px",
      marginTop: "50px",
      width: "100vw",
    },
    titleArea: {
      maxWidth: "200px",
      margin: "auto",
      textAlign: "center",
      paddingTop: "15px",
      fontSize: "14px",
    },
  };

  const darkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#000",
      transform:'scaleX(1.3)',
    },
    prev: {
      display: "none",
    },
    next: {
      display: "none",
    },
    containerExpanded: {
      transform: "translateX(-100vw)",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      left: "none",
      right: "0px",
      position: "fixed",
    },
    tocButtonBarTop: {
      ...ReactReaderStyle.tocButtonBarTop,
      background: "#4D5250",
      height: "2px",
    },
    tocButtonBottom: {
      ...ReactReaderStyle.tocButtonBottom,
      background: "#4D5250",
      height: "3px",
    },

    tocArea: {
      ...ReactReaderStyle.tocArea,
      left: "none",
      right: "0px",
      marginTop: "50px",
      width: "100vw",
    },
    titleArea: {
      maxWidth: "200px",
      margin: "auto",
      textAlign: "center",
      paddingTop: "15px",
      fontSize: "14px",
    },
  };

  const midDarkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#48484a",
      transform:'scaleX(1.3)',
    },
    prev: {
      display: "none",
    },
    next: {
      display: "none",
    },
    containerExpanded: {
      transform: "translateX(-100vw)",
    },
    tocButtonBarTop: {
      ...ReactReaderStyle.tocButtonBarTop,
      background: "#4D5250",
      height: "2px",
    },
    tocButtonBottom: {
      ...ReactReaderStyle.tocButtonBottom,
      background: "#4D5250",
      height: "3px",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      left: "none",
      right: "0px",
      position: "fixed",
    },

    tocArea: {
      ...ReactReaderStyle.tocArea,
      left: "none",
      right: "0px",
      marginTop: "50px",
      width: "100vw",
    },
    titleArea: {
      maxWidth: "200px",
      margin: "auto",
      textAlign: "center",
      paddingTop: "15px",
      fontSize: "14px",
    },
  };

  const greenReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#ceeaba",
      transform:'scaleX(1.3)',
    },
    prev: {
      display: "none",
    },
    next: {
      display: "none",
    },
    tocButtonBarTop: {
      ...ReactReaderStyle.tocButtonBarTop,
      background: "#4D5250",
      height: "2px",
    },
    tocButtonBottom: {
      ...ReactReaderStyle.tocButtonBottom,
      background: "#4D5250",
      height: "3px",
    },
    containerExpanded: {
      transform: "translateX(-100vw)",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      left: "none",
      right: "0px",
      position: "fixed",
    },

    tocArea: {
      ...ReactReaderStyle.tocArea,
      left: "none",
      right: "0px",
      marginTop: "50px",
      width: "100vw",
    },
    titleArea: {
      maxWidth: "200px",
      margin: "auto",
      textAlign: "center",
      paddingTop: "15px",
      fontSize: "14px",
    },
  };

  const pinkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#f8f2e5",
      transform:'scaleX(1.3)',
    },
    prev: {
      display: "none",
    },
    next: {
      display: "none",
    },
    tocButtonBarTop: {
      ...ReactReaderStyle.tocButtonBarTop,
      background: "#4D5250",
      height: "2px",
    },
    tocButtonBottom: {
      ...ReactReaderStyle.tocButtonBottom,
      background: "#4D5250",
      height: "3px",
    },
    containerExpanded: {
      transform: "translateX(-100vw)",
    },
    tocButton: {
      ...ReactReaderStyle.tocButton,
      left: "none",
      right: "0px",
      position: "fixed",
    },

    tocArea: {
      ...ReactReaderStyle.tocArea,
      left: "none",
      right: "0px",
      marginTop: "50px",
      width: "100vw",
    },
    titleArea: {
      maxWidth: "200px",
      margin: "auto",
      textAlign: "center",
      paddingTop: "15px",
      fontSize: "14px",
    },
  };

  const readerTheme = () => {
    if (theme === "dark") {
      return darkReaderTheme;
    } else if (theme === "green") {
      return greenReaderTheme;
    } else if (theme === "pink") {
      return pinkReaderTheme;
    } else if (theme === "midDark") {
      return midDarkReaderTheme;
    } else {
      return lightReaderTheme;
    }
  };

  const hideShow = () => {
    setTimeout(() => {
      setShow(false);
    }, 3000);
  };


  // useEffect(() => {
  //   const element = document.querySelector('.bookCover');
  //   if (element) {
  //     element.classList.add('openAnimation');
  //     setTimeout(() => {
  //       element.classList.remove('openAnimation');
  //     }, 2000); // Remove the animation class after 2 seconds
  //   }
  // }, [page]);

  return (
    <div
      className="book"
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <ReactReader
        url={epubUrl}
        epubOptions={{
          flow: mode === "scrolled" ? "scrolled" : "paginated",
          manager: "continuous",
        }}
        swipeable={mode === "paginated"}
        location={location}
        tocChanged={(_toc) => (toc.current = _toc)}
        // title={page}
        readerStyles={readerTheme()}
        locationChanged={(loc: string) => {
          setLocation(loc);
          if (rendition.current && toc.current) {
            const { displayed, href } = rendition.current.location.start;
            const chapter = toc.current.find((item) => item.href === href);
            setPage(
              `${chapter ? chapter.label : "n/a"} Bobidagi ${
                displayed.page
              } sahifa`
            );
            setShow(true);
            hideShow();
          }
        }}
        getRendition={(_rendition: Rendition) => {
          rendition.current = _rendition;
          _rendition.hooks.content.register((contents: Contents) => {
            const body = contents.window.document.querySelector("body");
            if (body) {
              body.oncontextmenu = () => {
                return false;
              };
            }
          });
          rendition.current.themes.fontSize(
            `${localStorage.getItem("fontSize") || fontSize}%`
          );
        }}
      />
      <a
        href="http://back"
        style={{
          position: "absolute",
          top: "10px",
          left: "0px",
          zIndex: 99,
        }}
      >
        <img
          style={{
            cursor: "pointer",
          }}
          src="/back.svg"
          width="35px"
          height="35px"
        />
      </a>
      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "40px",
          zIndex: 99,
        }}
      >
        <img
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: "pointer",
          }}
          src="/settings.svg"
          width="25px"
          height="25px"
        />
      </div>
{/* 
      <div className="bookCover"></div> */}

      <div
        style={{
          position: "absolute",
          top: "15px",
          right: "5px",
          zIndex: 0.5,
        }}
      >
        <img
          onClick={() => {
            rendition.current?.display(location.toString());
          }}
          style={{
            cursor: "pointer",
          }}
          src="/close.svg"
          width="25px"
          height="25px"
        />
      </div>

      <div
        style={{
          position: "absolute",
          background: "#f7f7f7",
          width: "100%",
          height: "40px",
          bottom: "0px",
          display: show ? 'flex' : 'none',
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1,
          textAlign: "center",
          transition: "0.5s ease",     
        }}
      >
        <p>{page}</p>
      </div>

      <div
        style={{
          position: "absolute",
          background: "white",
          bottom: "0",
          width: "92.5vw",
          height: "60vh",
          borderTopLeftRadius: "10px",
          borderTopRightRadius: "10px",
          padding: "14px",
          zIndex: 99,
          transition: "transform 0.4s ease-in-out",
          boxShadow: " 0px -1px 13px 1px #0b3d3433",
          display: isOpen ? "block" : "none",
        }}
      >
        <div>
          <p>Fon rangi</p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              justifyContent: "space-between",
            }}
          >
            <div
              className="color"
              onClick={() => {
                setTheme("light");
                localStorage.setItem("theme", "light");
              }}
              style={{
                background: "#ffffff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "light" ? "1px solid #F97010" : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Aa
            </div>
            <div
              className="color"
              onClick={() => {
                setTheme("green");
                localStorage.setItem("theme", "green");
              }}
              style={{
                background: "#ceeaba",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "green" ? "1px solid #F97010" : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Aa
            </div>

            <div
              className="color"
              onClick={() => {
                setTheme("pink");
                localStorage.setItem("theme", "pink");
              }}
              style={{
                background: "#f8f2e5",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "pink" ? "1px solid #F97010" : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Aa
            </div>
            <div
              className="color "
              onClick={() => {
                setTheme("midDark");
                localStorage.setItem("theme", "midDark");
              }}
              style={{
                background: "#48484a",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "midDark"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              Aa
            </div>
            <div
              className="color "
              onClick={() => {
                setTheme("dark");
                localStorage.setItem("theme", "dark");
              }}
              style={{
                background: "#000",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "dark" ? "1px solid #F97010" : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              Aa
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <p>Yozuv Turi</p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              justifyContent: "space-between",
            }}
          >
            <div
              onClick={() => {
                setFontFamily("'Literata', serif");
                localStorage.setItem("fontFamily", "'Literata', serif");
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Literata', serif"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Literata
            </div>
            <div
              onClick={() => {
                setFontFamily("'Arvo', serif");
                localStorage.setItem("fontFamily", "'Arvo', serif");
              }}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Arvo', serif"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              PT Serif
            </div>
            <div
              onClick={() => {
                setFontFamily("'Onest', sans-serif");
                localStorage.setItem("fontFamily", "'Onest', sans-serif");
              }}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Onest', sans-serif"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Avenir
            </div>
            <div
              onClick={() => {
                setFontFamily("'Roboto', sans-serif");
                localStorage.setItem("fontFamily", "'Roboto', sans-serif");
              }}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Roboto', sans-serif"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Roboto
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <p>Yozuv Kattaligi</p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              justifyContent: "space-between",
            }}
          >
            <div
              className="color selected"
              onClick={() => {
                if (fontSize < 400) {
                  setFontSize(fontSize + 10);
                  localStorage.setItem("fontSize", String(fontSize));
                  setSelectedStyles({
                    font1: true,
                    font2: false,
                  });
                }
              }}
              style={{
                background: "#FAFCFB",
                padding: "10px",
                borderRadius: "8px",
                width: "50vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                border: selectedStyles.font1
                  ? "1px solid #F97010"
                  : "1px solid #dadfdd",
              }}
            >
              A++
            </div>

            <div
              className="color"
              onClick={() => {
                if (fontSize > 50) {
                  setFontSize(fontSize - 10);
                  localStorage.setItem("fontSize", String(fontSize));
                  setSelectedStyles({
                    font1: false,
                    font2: true,
                  });
                }
              }}
              style={{
                background: "#FAFCFB",
                padding: "10px",
                borderRadius: "8px",
                width: "50vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                border: selectedStyles.font2
                  ? "1px solid #F97010"
                  : "1px solid #dadfdd",
              }}
            >
              A--
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "20px",
          }}
        >
          <p>O'qish tartibi</p>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginTop: "10px",
              justifyContent: "space-between",
            }}
          >
            <div
              className="color selected"
              onClick={() => {
                setMode("paginated");
                localStorage.setItem("mode", "paginated");
              }}
              style={{
                background: "#FAFCFB",
                padding: "10px",
                borderRadius: "8px",
                width: "50vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                border:
                  mode === "paginated"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
              }}
            >
              Horizontal
            </div>

            <div
              className="color"
              onClick={() => {
                setMode("scrolled");
                localStorage.setItem("mode", "scrolled");
              }}
              style={{
                background: "#FAFCFB",
                padding: "10px",
                borderRadius: "8px",
                width: "50vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
                border:
                  mode !== "paginated"
                    ? "1px solid #F97010"
                    : "1px solid #dadfdd",
              }}
            >
              Vertical
            </div>
          </div>
        </div>
      </div>

      <div
        onClick={() => {
          setIsOpen(false);
        }}
        style={{
          position: "absolute",
          background: "transparent",
          zIndex: 98,
          width: "100vw",
          height: "100vh",
          left: "0",
          top: "0",
          display: isOpen ? "block" : "none",
        }}
      ></div>
    </div>
  );
};

export default App;
