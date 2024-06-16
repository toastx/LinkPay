import { HoverEffect } from "@/components/ui/card-hover-effect";

export function HomeAbout() {
  return (
    <div className="  max-w-5xl mx-auto px-8 h-screen flex justify-center items-center">
      <HoverEffect items={projects} />
    </div>
  );
}
export const projects = [
  {
    title: "Create XML Links",
    description:
      "Create payment links that can be shard with others ",
    link: "",
  },
  {
    title: "Onboard Web2",
    description:
      "Send digital assets at scale, even to non-crypto users",
    link: "",
  },
  {
    title: "Pay easy, Pay secure",
    description:
      "Easily pay to the request by using lobster wallet in a secure environment",
    link: "",
  },
  {
    title: "Your Payment Gateway Simplified",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "",
  },
  {
    title: "Anytime, Anywhere",
    description:
      " Our blockchain solution enables you to create and share payment requests with ease, ensuring you get paid quickly and securely.",
    link: "",
  },
  {
    title: "Utilities and Bills",
    description:
      "Now Utility companies or service providers can send payment requests for monthly bills.",
    link: "",
  },

];
