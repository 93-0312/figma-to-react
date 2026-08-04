import * as React from "react";
import {
  Calendar,
  CalendarDateCell,
} from "../components/ui/calendar";
import type { DateRange } from "../components/ui/calendar";
import type { Story } from "../playground/types";

// Figma 렌더와 동일한 기준 장면: 2026-03, 오늘/선택 = 3/18
const FIGMA_TODAY = new Date(2026, 2, 18);

export const calendarStory: Story = {
  name: "Calendar",
  docs: "https://www.figma.com/design/LFA5EyNbUdPvi8Rbuf2tJC/BO-UI-Kit?node-id=7953-3826",
  controls: [
    { type: "boolean", name: "withPresets", label: "WithPresets", default: true },
    {
      type: "select",
      name: "monthYearControl",
      label: "MiddleElement Type",
      options: ["string", "inputs"],
      default: "string",
    },
    { type: "select", name: "mode", label: "mode", options: ["single", "range"], default: "single" },
  ],
  render: (args) => (
    <CalendarDemo
      withPresets={Boolean(args.withPresets)}
      monthYearControl={args.monthYearControl as "string" | "inputs"}
      mode={args.mode as "single" | "range"}
    />
  ),
  gallery: <CalendarGallery />,
};

function CalendarDemo({
  withPresets,
  monthYearControl,
  mode,
}: {
  withPresets: boolean;
  monthYearControl: "string" | "inputs";
  mode: "single" | "range";
}) {
  const [value, setValue] = React.useState<Date | null>(FIGMA_TODAY);
  const [range, setRange] = React.useState<DateRange>({
    from: new Date(2026, 2, 10),
    to: new Date(2026, 2, 14),
  });
  return (
    <Calendar
      mode={mode}
      value={value}
      onValueChange={setValue}
      rangeValue={range}
      onRangeChange={setRange}
      defaultMonth={FIGMA_TODAY}
      today={FIGMA_TODAY}
      withPresets={withPresets}
      monthYearControl={monthYearControl}
    />
  );
}

function CalendarGallery() {
  return (
    <div className="flex flex-col gap-8">
      <Labeled label="WithPresets=True · 오늘=선택=3/18 (Figma 기준 장면)">
        <Calendar defaultValue={FIGMA_TODAY} defaultMonth={FIGMA_TODAY} today={FIGMA_TODAY} />
      </Labeled>
      <Labeled label="WithPresets=False">
        <Calendar withPresets={false} defaultValue={FIGMA_TODAY} defaultMonth={FIGMA_TODAY} today={FIGMA_TODAY} />
      </Labeled>
      <Labeled label="Range 선택 (RangeLeft / Range / RangeRight)">
        <Calendar
          mode="range"
          defaultRangeValue={{ from: new Date(2026, 2, 10), to: new Date(2026, 2, 14) }}
          defaultMonth={FIGMA_TODAY}
          today={FIGMA_TODAY}
        />
      </Labeled>
      <Labeled label=".MiddleCalendarElement Type=Inputs (월/년 셀렉트)">
        <Calendar
          monthYearControl="inputs"
          withPresets={false}
          defaultValue={FIGMA_TODAY}
          defaultMonth={FIGMA_TODAY}
          today={FIGMA_TODAY}
        />
      </Labeled>
      <Labeled label="비활성 날짜 (isDateDisabled — 주말)">
        <Calendar
          withPresets={false}
          defaultMonth={FIGMA_TODAY}
          today={FIGMA_TODAY}
          isDateDisabled={(d) => d.getDay() === 0 || d.getDay() === 6}
        />
      </Labeled>
      {/* .CalendarDate 8개 variant 전수 매트릭스(IsToday off/on) — Figma 세트 1:1 */}
      <Labeled label=".CalendarDate variant 매트릭스 (Type 8종 × IsToday)">
        <div className="flex flex-col gap-2">
          {[false, true].map((isToday) => (
            <div key={String(isToday)} className="flex items-center gap-2.5">
              <span className="w-24 text-xs text-muted-foreground">
                IsToday={String(isToday)}
              </span>
              <CalendarDateCell cell="default" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="nextMonth" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="hover" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="range" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="selected" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="rangeLeft" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="rangeRight" isToday={isToday}>3</CalendarDateCell>
              <CalendarDateCell cell="muted" selectable={false} isToday={isToday}>3</CalendarDateCell>
            </div>
          ))}
        </div>
      </Labeled>
    </div>
  );
}

function Labeled({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
