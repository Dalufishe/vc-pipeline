import { useEffect, useState } from "react";

type Platform = "macOS" | "Windows" | "Linux" | "Unknown";

export const usePlatform = () => {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatform = async () => {
      try {
        const response = await fetch("/api/utils/platform");
        const data = await response.json();
        setPlatform(data.platform as Platform);
      } catch (error) {
        console.error("Error fetching platform:", error);
        setPlatform("Unknown");
      } finally {
        setLoading(false);
      }
    };

    fetchPlatform();
  }, []);

  return { platform, loading };
};
