import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "সোনার দাম - Sonar Dam",
    short_name: "সোনার দাম",
    description: "কলকাতার আজকের লাইভ সোনার দাম ও মাসিক ক্যালেন্ডার",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#1c1917",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
