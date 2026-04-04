import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  label?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({
  targetDate,
  label = 'Time until next session',
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference / (1000 * 60 * 60)) % 24
          ),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!mounted || !timeLeft) {
    return (
      <div className="text-center">
        <p className="text-sm text-indrox-cream/60">{label}</p>
        <div className="text-2xl font-bold text-indrox-gold mt-2">Loading...</div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <p className="text-sm text-indrox-cream/60 mb-3">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {[
          { value: timeLeft.days, label: 'Days' },
          { value: timeLeft.hours, label: 'Hours' },
          { value: timeLeft.minutes, label: 'Mins' },
          { value: timeLeft.seconds, label: 'Secs' },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-indrox-bg-card border border-indrox-purple/20 rounded-lg p-3"
          >
            <div className="text-2xl font-bold text-indrox-gold">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-xs text-indrox-cream/60 mt-1">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
