import useLocalStorageState from "use-local-storage-state";

import { useEffect, useRef, useState } from "react";
import type { Contents, NavItem, Rendition } from "epubjs";
import { IReactReaderStyle, ReactReader, ReactReaderStyle } from "react-reader";

function updateTheme(rendition: Rendition, theme: string) {
  const themes = rendition.themes;
  switch (theme) {
    case "dark": {
      themes.override("color", "#fff");
      themes.override("background", "#48484a");
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
  }
}

function updateFontFamily(rendition: Rendition, font: string) {
  const themes = rendition.themes;
  switch (font) {
    case "'Arvo', serif": {
      themes.override("font-family", "'Arvo', serif");
      break;
    }
    case "'Source Code Pro', monospace": {
      themes.override("font-family", "'Source Code Pro', monospace");
      break;
    }
    case "'Playpen Sans', cursive": {
      themes.override("font-family", "'Playpen Sans', cursive");
      break;
    }
    case "'Onest', sans-serif": {
      themes.override("font-family", "'Onest', sans-serif");
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function renderBook(url: string) {
    setEpubUrl(url);
  }

  console.log(renderBook(''))

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
        console.log("working", localFont);
        updateFontFamily(rendition.current, localFont || "");
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
      if (locTheme === "dark" && rendition.current) {
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
    },
  };

  const darkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#48484a",
    },
  };

  const greenReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#ceeaba",
    },
  };

  const pinkReaderTheme: IReactReaderStyle = {
    ...ReactReaderStyle,
    readerArea: {
      ...ReactReaderStyle.readerArea,
      background: "#f8f2e5",
    },
  };

  const readerTheme = () => {
    if (theme === "dark") {
      return darkReaderTheme;
    } else if (theme === "green") {
      return greenReaderTheme;
    } else if (theme === "pink") {
      return pinkReaderTheme;
    } else {
      return lightReaderTheme;
    }
  };

  return (
    <div
      className="test"
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <ReactReader
        url={epubUrl}
        epubOptions={{
          flow: mode,
          manager: "continuous",
        }}
        swipeable={mode === "paginated"}
        title="Yoki - Ebook Reader"
        location={location}
        tocChanged={(_toc) => (toc.current = _toc)}
        readerStyles={readerTheme()}
        locationChanged={(loc: string) => {
          setLocation(loc);
          if (rendition.current && toc.current) {
            const { displayed } = rendition.current.location.start;
            // const chapter = toc.current.find((item) => item.href === href)
            setPage(`Page ${displayed.page} of ${displayed.total}`);
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
      <div
        style={{
          position: "absolute",

          top: "15px",
          right: "10px",

          zIndex: 99,
        }}
      >
        <img
          onClick={() => setIsOpen(!isOpen)}
          style={{
            cursor: "pointer",
          }}
          src="/files/settings.svg"
          width="25px"
          height="25px"
        />
      </div>

      <div
        style={{
          position: "absolute",
          background: "white",
          bottom: "0",
          width: "90vw",
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
                  theme === "light" ? "1px solid #FFFF00" : "1px solid #dadfdd",
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
                  theme === "green" ? "1px solid #FFFF00" : "1px solid #dadfdd",
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
                setTheme("dark");
                localStorage.setItem("theme", "dark");
              }}
              style={{
                background: "#48484a",
                padding: "10px",
                borderRadius: "8px",
                border:
                  theme === "dark" ? "1px solid #FFFF00" : "1px solid #dadfdd",
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
                  theme === "pink" ? "1px solid #FFFF00" : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
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
                setFontFamily("'Arvo', serif");
                localStorage.setItem("fontFamily", "'Arvo', serif");
              }}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Arvo', serif"
                    ? "1px solid #FFFF00"
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
                setFontFamily("'Source Code Pro', monospace");
                localStorage.setItem(
                  "fontFamily",
                  "'Source Code Pro', monospace"
                );
              }}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Source Code Pro', monospace"
                    ? "1px solid #FFFF00"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Playpan
            </div>
            <div
              onClick={() => {
                setFontFamily("'Playpen Sans', cursive");
                localStorage.setItem("fontFamily", "'Playpen Sans', cursive");
              }}
              style={{
                background: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border:
                  fontFamily === "'Playpen Sans', cursive"
                    ? "1px solid #FFFF00"
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
                    ? "1px solid #FFFF00"
                    : "1px solid #dadfdd",
                width: "20vw",
                boxSizing: "border-box",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              Onest
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
                  ? "1px solid #FFFF00"
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
                  ? "1px solid #FFFF00"
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
                    ? "1px solid #FFFF00"
                    : "1px solid #dadfdd",
              }}
            >
              Horizontal
            </div>

            <div
              className="color"
              onClick={() => {
                setMode("scrolled");
                localStorage.setItem("page", "scrolled");
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
                    ? "1px solid #FFFF00"
                    : "1px solid #dadfdd",
              }}
            >
              Vertical
            </div>
          </div>
        </div>
      </div>

      {page && (
        <div
          style={{
            position: "absolute",
            background: "white",
            bottom: "20px",
            width: "50vw",
            right: "25vw",

            borderRadius: "10px",

            zIndex: 98,
            boxShadow: " 0px -1px 13px 1px #0b3d3433",
            textAlign: "center",
            padding: "5px",
            fontWeight: "600",
          }}
        >
          {page}
        </div>
      )}

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
