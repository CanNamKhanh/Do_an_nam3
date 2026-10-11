import type { Event, Prisma } from "@prisma/client";
import { HttpError } from "../../lib/http-error";
import { prisma } from "../../lib/prisma";
import { isValidRange, RANGE_ERROR } from "./event.schema";
import type {
  CreateEventInput,
  ListEventsQuery,
  PublicEventsQuery,
  UpdateEventInput,
} from "./event.schema";

export function listEvents({
  isActive,
  from,
  to,
}: ListEventsQuery): Promise<Event[]> {
  const startTime: Prisma.DateTimeFilter = { gte: from, lte: to };
  return prisma.event.findMany({
    where: { isActive, startTime },
    orderBy: { startTime: "asc" },
  });
}

export function getEvent(id: number): Promise<Event> {
  return prisma.event.findUniqueOrThrow({ where: { id } });
}

export function createEvent(
  input: CreateEventInput,
  createdById: number,
): Promise<Event> {
  return prisma.event.create({ data: { ...input, createdById } });
}

export async function updateEvent(
  id: number,
  input: UpdateEventInput,
): Promise<Event> {
  if (input.startTime !== undefined || input.endTime !== undefined) {
    const current = await prisma.event.findUniqueOrThrow({
      where: { id },
      select: { startTime: true, endTime: true },
    });
    const start = input.startTime ?? current.startTime;
    const end = input.endTime === undefined ? current.endTime : input.endTime;
    if (!isValidRange(start, end)) {
      throw HttpError.badRequest(RANGE_ERROR);
    }
  }
  return prisma.event.update({ where: { id }, data: input });
}

export async function deleteEvent(id: number): Promise<void> {
  await prisma.event.delete({ where: { id } });
}

const publicEventSelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  startTime: true,
  endTime: true,
  isActive: true,
} satisfies Prisma.EventSelect;

export type PublicEvent = Prisma.EventGetPayload<{
  select: typeof publicEventSelect;
}>;

export function listPublicEvents({
  from,
  to,
}: PublicEventsQuery): Promise<PublicEvent[]> {
  return prisma.event.findMany({
    where: { isActive: true, startTime: { gte: from, lte: to } },
    select: publicEventSelect,
    orderBy: { startTime: "asc" },
  });
}
