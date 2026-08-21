import NextAlarmWidget from './NextAlarmWidget';
import PomodoroTimer from './PomodoroTimer';
import MiniCalendar from './MiniCalendar';

export default function RightPanel({ tasks, user }) {
  return (
    <div className="flex flex-col gap-5 h-full">
      {/* Next Alarm Widget */}
      <NextAlarmWidget tasks={tasks} />

      {/* Pomodoro Timer */}
      <PomodoroTimer />

      {/* Mini Calendar */}
      <MiniCalendar tasks={tasks} />
    </div>
  );
}