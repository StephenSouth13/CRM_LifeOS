import { RoomBooking } from "@/components/room-booking"

export default function RoomsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meeting Rooms</h1>
        <p className="text-muted-foreground">Book meeting rooms and manage your reservations</p>
      </div>

      <RoomBooking />
    </div>
  )
}
