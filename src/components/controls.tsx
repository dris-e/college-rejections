import { TriangleUpIcon, EyeOpenIcon, Share2Icon } from "@radix-ui/react-icons";
import { RejectionWithCollege } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCookie } from "@/contexts/cookie";

export function Controls({ rejection, type }: { rejection: RejectionWithCollege; type: "card" | "dialog" }) {
  const { hasUpvoted, addUpvote, removeUpvote } = useCookie();

  const handleUpvote = () => {
    if (hasUpvoted(rejection.id)) {
      removeUpvote(rejection.id);
      rejection.upvotes--;
    } else {
      addUpvote(rejection.id);
      rejection.upvotes++;
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/${rejection.id}`);
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${rejection.name} got rejected from ${rejection.college.name}`,
          text: `no way ${rejection.name.split(" ")[0].toLowerCase()} got rejected with a ${rejection.gpa} gpa`,
          url: `${window.location.origin}/${rejection.id}`,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  const controls = [
    {
      icon: TriangleUpIcon,
      label: rejection.upvotes,
      action: handleUpvote,
    },
    {
      icon: EyeOpenIcon,
      label: rejection.views,
      action: () => {},
    },
    {
      icon: Share2Icon,
      label: "Share",
      action: handleShare,
    },
  ];

  return type === "card" ? (
    <div className="flex justify-start items-center gap-4">
      {controls.map((control, index) => (
        <button key={index} onClick={control.action} className="flex justify-start items-center gap-2 hover:underline">
          <control.icon className={`w-4 h-4 ${index === 0 && hasUpvoted(rejection.id) ? "text-cr-green" : "text-muted-foreground"}`} />
          <span className="text-sm text-muted-foreground">{index !== 2 ? control.label : ""}</span>
        </button>
      ))}
    </div>
  ) : (
    <div className="flex w-full justify-start items-center gap-2">
      {controls.map((control, index) => (
        <Button variant={index === 0 && hasUpvoted(rejection.id) ? "action" : "outline"} size="sm" key={index} onClick={control.action}>
          <control.icon className={`w-4 h-4`} />
          <span>{control.label}</span>
        </Button>
      ))}
    </div>
  );
}
