export function LoadingView() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ padding: "4rem 0" }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e0e0e0",
          borderTopColor: "#2D8B4E",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          marginBottom: "1.25rem",
        }}
      />
      <p style={{ color: "#2D8B4E", fontWeight: 500, fontSize: "1rem" }}>
        Finding your dinner...
      </p>
    </div>
  );
}
