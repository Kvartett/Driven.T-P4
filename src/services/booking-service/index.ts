import { forbiddenError, notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);

  if (!booking) {
    throw notFoundError();
  }

  const body = {
    id: booking.id,
    Room: booking.roomId,
  };

  return body;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const roomExist = await bookingRepository.findRoom(roomId);

  if (!roomExist) {
    throw notFoundError();
  }

  const roomBooking = await bookingRepository.findManyBookingRoom(roomId);

  if (roomBooking.length >= roomExist.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);
  
  return booking;
}

async function changeBooking(userId: number, roomId: number, bookingId: number) {
  const userBooking = await bookingRepository.findBooking(userId);

  if (!userBooking) {
    throw forbiddenError();
  }

  const roomExist = await bookingRepository.findRoom(roomId);

  if (!roomExist) {
    throw notFoundError();
  }

  const roomBooking = await bookingRepository.findManyBookingRoom(roomId);

  if (roomBooking.length >= roomExist.capacity) {
    throw forbiddenError();
  }

  const booking = await bookingRepository.updateBooking(roomId, bookingId);

  return booking;
}

const bookingService = {
  getBooking,
  createBooking,
  changeBooking,
};
  
export default bookingService;
