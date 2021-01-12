import { useEffect, useRef, useState } from "react";

const WrapperImg = ({ children }) => {
  const wrapperRef = useRef(null);
  const [isDOMReady, setIsDOMReady] = useState(false);

  const resizeElement = (element) => {
    if (!wrapperRef.current) {
      return;
    }

    const { current: wrapper } = wrapperRef;
    const rowHeight = Number.parseInt(
      getComputedStyle(wrapper).getPropertyValue("grid-auto-rows")
    );
    const rowGap = Number.parseInt(
      getComputedStyle(wrapper).getPropertyValue("grid-row-gap")
    );

    // problem with getBoundingClientReact() !!!!!!!
    // const spanValue = Math.ceil(
    //   (element.getBoundingClientReact().height + rowGap) / (rowHeight + rowGap)
    // );
    const spanValue = Math.ceil(
      (element.height + rowGap) / (rowHeight + rowGap)
    );

    if (spanValue) {
      element.style.gridRowEnd = `span ${spanValue}`;
    }
  };

  const resizeElements = () =>
    Array.from(wrapperRef.current.children).forEach((child) =>
      resizeElement(child)
    );

  useEffect(() => {
    if (!isDOMReady) {
      setIsDOMReady(true);
    } else {
      resizeElements();
    }
  }, [isDOMReady, resizeElements]);

  useEffect(() => {
    const config = { attributes: true, childList: true, subtree: true };
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.target.tagName === "IMG") {
          mutation.target.addEventListener("load", resizeElements, false);
        }
      });
    });
    observer.observe(wrapperRef.current, config);
    window.addEventListener("resize", resizeElements);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resizeElements);
    };
  }, []);

  return (
    <div className='wrapper-img' ref={wrapperRef}>
      {children}
    </div>
  );
};

export default WrapperImg;
