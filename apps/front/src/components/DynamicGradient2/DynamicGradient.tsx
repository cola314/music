import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import tw, { css } from 'twin.macro';

import { randomNumber } from '@/utils/random';

import { Circle } from './Circle';

interface DynamicGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  colors: string[];
  circleAmount?: number;
  fps?: number;
  speed?: number;
}

// TODO: pause animation
export const DynamicGradient: React.FC<DynamicGradientProps> = ({
  colors,
  circleAmount = 10,
  fps = 60,
  speed = 1,
  children,
  ...props
}) => {
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const reqAnimRef = useRef<number>();
  const lastAnimateTimeRef = useRef<number>();
  const animateInterval = useMemo(() => 1000 / fps, [fps]);
  const PI2 = useMemo(() => Math.PI * 2, []);

  // const circlesRef = useRef<Circle[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);

  // const setCircles = useCallback((circles: Circle[]) => {
  //   circlesRef.current = circles;
  // }, []);

  const createCircles = useCallback(() => {
    if (!containerRef.current) return;
    const newCircles = [];

    const xmin = -15;
    const xmax = 115;
    const ymin = -15;
    const ymax = 115;

    for (let i = 1; i <= circleAmount; i++) {
      // const colors = ["#00f", "#00a", "#00b", "#00c", "#00d", "#00e"];
      newCircles.push(
        new Circle(
          randomNumber(xmin, xmax),
          randomNumber(ymin, ymax),
          randomNumber(-0.005, 0.005) * speed,
          randomNumber(-0.005, 0.005) * speed,
          randomNumber(150, 200),
          colors[Math.round(randomNumber(0, colors.length - 1))],
          xmin,
          xmax,
          ymin,
          ymax,
        ),
      );
    }

    setCircles(newCircles);
    lastAnimateTimeRef.current = Date.now();
  }, [circleAmount, colors, setCircles, speed]);

  const animate = useCallback(() => {
    const { current: lastAnimateTime } = lastAnimateTimeRef;
    // const { current: circles } = circlesRef;
    if (lastAnimateTime === undefined) return;

    const now = Date.now();
    const delta = now - lastAnimateTime;
    if (delta > animateInterval) {
      setCircles((prev) => prev.map((circle) => circle.animate(delta)));
      // renderCircles();

      lastAnimateTimeRef.current = now;
    }
    reqAnimRef.current = window.requestAnimationFrame(animate);
  }, [animateInterval, setCircles]);

  useEffect(() => {
    createCircles();
    reqAnimRef.current = window.requestAnimationFrame(animate);

    return () => {
      if (reqAnimRef.current) window.cancelAnimationFrame(reqAnimRef.current);
    };
  }, [animate, createCircles]);

  const renderedCircles = useMemo(() => {
    return circles.map((circle, idx) => (
      <div
        key={idx}
        className="circle"
        css={[
          tw`absolute`,
          tw`origin-center transition-transform duration-[1s] ease-linear`,
          css`
            /* left: ${circle.x}%;
            top: ${circle.y}%; */
            border-radius: 100%;

            /* width: ${circle.r}rem;
            height: ${circle.r}rem; */

            background: radial-gradient(${circle.color} 0%, ${circle.color}00 70%);
          `,
        ]}
        style={{
          transform: `translateX(-50%) translateY(-50%)`,
          left: `${circle.x}%`,
          top: `${circle.y}%`,
          width: `${circle.r}rem`,
          height: `${circle.r}rem`,
        }}
      />
    ));
  }, [circles]);

  return (
    <div ref={containerRef} {...props}>
      <div
        css={[
          tw`absolute w-full h-full -z-50`,
          css`
            background-color: ${colors.at(0)};
          `,
        ]}
      />
      <div
        css={[
          tw`absolute overflow-hidden w-full h-full -z-40 top-0`,
          css`
            background-color: ${colors[0]};
            filter: url(#circle);
          `,
        ]}
      >
        {renderedCircles}
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
          <defs>
            <filter id="circle">
              <feGaussianBlur in="SourceGraphic" stdDeviation="35" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 40 -10"
              />
              <feColorMatrix type="saturate" in="SourceGraphic" values="1" />
            </filter>
          </defs>
        </svg>
      </div>
      {children}
    </div>
  );
};
