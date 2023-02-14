import { AuthenticatedRequest } from "@/middlewares";
import bookingService from "@/services/booking-service";
import { Response } from "express";
import httpStatus, { BAD_REQUEST } from "http-status";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  try {
    const booking = await bookingService.getBooking(Number(userId));

    return res.status(httpStatus.OK).send(booking);
  } catch (err) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;

  try {
    if (!roomId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }

    const booking = await bookingService.createBooking(Number(userId), Number(roomId));
    return res.status(httpStatus.OK).send({ bookingId: booking.id });
  } catch (err) {
    if (err.name === "NotFoundError") {    
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (err.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const bookingId = Number(req.params.bookingId);

  try {
    const booking = await bookingService.changeBooking(Number(userId), Number(roomId), bookingId);
    return res.status(httpStatus.OK).send(booking.id.toString());
  } catch (err) {
    if (err.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (err.name === "ForbiddenError") {
      return res.sendStatus(httpStatus.FORBIDDEN);
    }

    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
