import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function UploadCountdown({
  finished,
  file,
}: {
  finished: boolean;
  file: File | null;
}) {
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" absolute bottom-4 right-4 bg-white shadow p-4 rounded-md w-72">
      <p>Upload (1)</p>
      <div className="bg-neutral-100 p-3 shadow-sm mt-2 ">
        {finished ? (
          <div>✅ Processing complete!</div>
        ) : (
          <div className="flex gap-2">
            <Loader2 className="animate-spin" />
            <div>
              <p className="font-medium">{file?.name}</p>
              <div>Processing... {timeLeft}s left</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
