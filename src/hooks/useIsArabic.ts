import { useEffect, useState } from "react";

export function useIsArabic() {
  const [isArabic, setIsArabic] = useState(
    typeof document !== "undefined" && document.documentElement.lang === "ar"
  );

  useEffect(() => {
    const sync = () => setIsArabic(document.documentElement.lang === "ar");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    return () => observer.disconnect();
  }, []);

  return isArabic;
}
