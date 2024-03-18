import { Spin } from "antd";
import React, { useEffect, useRef } from "react";

function InfiniteScroll({ hasMore, loading, loadMore }) {
  const observerTarget = useRef(null);
  useEffect(() => {
    if (!loading) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMore();
          }
        },
        { threshold: 1 }
      );

      if (observerTarget.current) {
        observer.observe(observerTarget.current);
      }
      return () => {
        if (observerTarget.current) {
          observer.unobserve(observerTarget.current);
        }
      };
    }
  }, [observerTarget, loading, hasMore]);
  return (
    <div  ref={observerTarget} style={{ paddingTop: 300, marginTop: -400 }}>
      {hasMore && (
        <div>
          {loading && (
            <center><Spin /></center>
          )}
        </div>
      )}
      {!hasMore && <center>no more</center>}
    </div>
  );
}
export default InfiniteScroll;
