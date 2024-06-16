"use client";
import { MaskContainer } from "@/components/ui/about-svg-mask-effect";

export function About() {
  return (
    <div className="h-screen w-full flex items-center justify-center  overflow-hidden">
      <MaskContainer
        revealText={
          <p className="max-w-4xl  text-white text-center  text-4xl font-bold">
            Create, Share and Pay Link
          </p>
        }
        className="h-[40rem] rounded-md"
      >
        Create a <span className="text-red-500">link</span> with the amount you wanted to receive and your public key.
        <br /> <br />
        <span className="text-red-500">Share it</span> to your friends<br /> <br />
        That's it, request made simple. they can <span className="text-red-500">pay</span> using that link

      </MaskContainer>
    </div>
  );
}
