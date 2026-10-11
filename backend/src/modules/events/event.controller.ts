import type { Request, Response } from "express";
import { getAuthUser } from "../../middlewares/authenticate";
import {
  createEventSchema,
  eventIdParamSchema,
  listEventsQuerySchema,
  publicEventsQuerySchema,
  updateEventSchema,
} from "./event.schema";
import * as eventService from "./event.service";

export async function list(req: Request, res: Response): Promise<void> {
  const query = listEventsQuerySchema.parse(req.query);
  res.json(await eventService.listEvents(query));
}

export async function getOne(req: Request, res: Response): Promise<void> {
  const { id } = eventIdParamSchema.parse(req.params);
  res.json(await eventService.getEvent(id));
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = createEventSchema.parse(req.body);
  const event = await eventService.createEvent(input, getAuthUser(req).id);
  res.status(201).json(event);
}

export async function update(req: Request, res: Response): Promise<void> {
  const { id } = eventIdParamSchema.parse(req.params);
  const input = updateEventSchema.parse(req.body);
  res.json(await eventService.updateEvent(id, input));
}

export async function remove(req: Request, res: Response): Promise<void> {
  const { id } = eventIdParamSchema.parse(req.params);
  await eventService.deleteEvent(id);
  res.status(204).send();
}

export async function listPublic(req: Request, res: Response): Promise<void> {
  const range = publicEventsQuerySchema.parse(req.query);
  res.json(await eventService.listPublicEvents(range));
}
