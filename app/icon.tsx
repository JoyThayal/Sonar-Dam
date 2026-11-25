import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #1c1917 0%, #292524 100%)",
        borderRadius: "110px",
        border: "14px solid #d97706",
      }}
    >
      <div
        style={{
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #fbbf24 0%, #b45309 100%)",
          marginBottom: "24px",
          boxShadow: "0 10px 30px rgba(245, 158, 11, 0.4)",
        }}
      />
      <div
        style={{
          fontSize: 84,
          fontWeight: 800,
          color: "#fef3c7",
          letterSpacing: "-1px",
        }}
      >
        সোনার দাম
      </div>
    </div>,
    { ...size },
  );
}
