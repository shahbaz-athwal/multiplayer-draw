"use client";
import { useDraw } from "@/hooks/useDraw";

const Page = () => {
  const { canvasRef, onMouseDown } = useDraw(drawLine);

  function drawLine({ ctx, currentPoint, prevPoint }: Draw) {
    const { x: currX, y: currY } = currentPoint;
    const color = "#000000";
    const lineWidth = 5;

    let startPoint = prevPoint ?? currentPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
  }
  return (
    <div className="flex justify-center w-screen h-screen items-center">
      <canvas
        onMouseDown={onMouseDown}
        ref={canvasRef}
        width={750}
        height={750}
        className="border border-black rounded-md"
      />
    </div>
  );
};

export default Page;
