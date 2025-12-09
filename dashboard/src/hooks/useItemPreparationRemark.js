import { useEffect, useState } from "react";
import { getItemPreparationRemarks } from "@/lib/utils";

export default function useItemPreparationRemark(item) {
  const [remarks, setRemarks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item) {
      setRemarks([]);
      return;
    }

    let isMounted = true;

    async function fetchRemarks() {
      try {
        setIsLoading(true);
        setError(null);

        const res = await getItemPreparationRemarks(item);

        if (!isMounted) return;

        if (res?.success) {
          setRemarks(res.remarks || []);
        } else {
          setRemarks([]);
        }
      } catch (err) {
        if (!isMounted) return;
        console.error("Failed to load preparation remarks:", err);
        setError(err);
        setRemarks([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchRemarks();

    return () => {
      isMounted = false;
    };
  }, [item]);

  return {
    remarks,
    isLoading,
    error,
  };
}
