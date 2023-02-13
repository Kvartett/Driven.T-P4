import { prisma } from "@/config";
import { Booking } from "@prisma/client";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId,
    },
  });
}

async function findManyBookingRoom(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId: roomId,
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  console.log("userId", "roomId");
  console.log(userId, roomId);
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

async function updateBooking(roomId: number, bookingId: number) {
  return prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      roomId: roomId,
    }
  });
}

async function findRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
  });
}

async function updateCapacity(roomId: number, calcNewValue: number) {
  const room = await prisma.room.findFirst({
    where: {
      id: roomId,
    }
  });
    
  const newCapacity = room.capacity + (calcNewValue);

  return prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      capacity: newCapacity
    }
  });
}

export type NewBooking = Omit<Booking, "id" | "createdAt" | "updatedAt">

const bookingRepository = {
  findBooking,
  findManyBookingRoom,
  createBooking,
  updateBooking,
  findRoom,
  updateCapacity,
};

export default bookingRepository;
