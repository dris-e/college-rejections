import { TriangleUpIcon, EyeOpenIcon, Share2Icon } from "@radix-ui/react-icons";
import { RejectionWithCollege } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Controls({ rejection, type }: { rejection: RejectionWithCollege; type: "card" | "dialog" }) {
  const controls = [
    {
      icon: TriangleUpIcon,
      label: rejection.upvotes,
      action: () => {
        console.log("upvotes");
      },
    },
    {
      icon: EyeOpenIcon,
      label: rejection.views,
      action: () => {
        console.log("views");
      },
    },
    {
      icon: Share2Icon,
      label: "Share",
      action: () => {
        console.log("share");
      },
    },
  ];

  return type === "card" ? (
    <div className="flex justify-start items-center gap-4">
      {controls.map((control, index) => (
        <button key={index} onClick={control.action} className="flex justify-start items-center gap-2 hover:underline">
          <control.icon className={`w-4 h-4 ${index === 0 ? "text-cr-green" : "text-muted-foreground"}`} />
          <span className="text-sm text-muted-foreground">{index !== 2 ? control.label : ""}</span>
        </button>
      ))}
    </div>
  ) : (
    <div className="flex w-full justify-start items-center gap-2">
      {controls.map((control, index) => (
        <Button variant={index === 0 ? "action" : "outline"} size="sm" key={index} onClick={control.action}>
          <control.icon className={`w-4 h-4`} />
          <span>{control.label}</span>
        </Button>
      ))}
    </div>
  );
}
