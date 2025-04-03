"use client";

export function ScrumCycleLoader() {
  return (
    <div className="hidden sm:flex justify-center items-center flex-col gap-6">
      <div className="loader">
        <div className="loader__orbit">
          <div className="loader__dot" />
          <div className="loader__dot" />
          <div className="loader__dot" />
          <div className="loader__dot" />
        </div>
        <div className="loader__inner" />
      </div>
    </div>
  );
}
