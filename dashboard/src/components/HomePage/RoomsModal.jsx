import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { call } from "@/lib/frappeClient";
import { useCartStore } from "@/stores/useCartStore";
import Loader from "@/components/Loader";

const RoomsModal = ({ open, onOpenChange }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { startNewTakeAwayOrder, setCustomer, setCustomerName } = useCartStore();

  useEffect(() => {
    if (open) {
      fetchRooms();
    } else {
      // Reset state when modal closes
      setRooms([]);
      setError(null);
    }
  }, [open]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await call.get("havano_restaurant_pos.api.get_booked_rooms");
      if (response.message && response.message.success) {
        setRooms(response.message.rooms || []);
      } else {
        setError(response.message?.message || "Failed to fetch rooms");
      }
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError(err?.message || "Failed to fetch rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSelect = (room) => {
    if (!room.customer) {
      setError(`Room ${room.room_number} does not have a customer assigned. Please ensure the guest has a customer linked.`);
      return;
    }

    // Set customer from room guest
    setCustomer(room.customer);
    setCustomerName(room.customer_name || room.customer);
    
    // Start a new take away order with room customer
    startNewTakeAwayOrder();
    
    // Close modal and navigate to menu
    onOpenChange(false);
    navigate("/menu");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select Room</DialogTitle>
          <DialogDescription>
            Choose a room to bill for the guest. The order will be billed under the customer/guest in the occupied room.
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        )}

        {error && !loading && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4">
            {error}
          </div>
        )}

        {!loading && !error && rooms.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No booked rooms available at the moment.
          </div>
        )}

        {!loading && !error && rooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {rooms.map((room) => (
              <div
                key={room.name}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                  !room.customer
                    ? "opacity-50 cursor-not-allowed border-destructive"
                    : "hover:border-primary"
                }`}
                onClick={() => room.customer && handleRoomSelect(room)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">Room {room.room_number}</h3>
                    {room.room_name && room.room_name !== room.room_number && (
                      <p className="text-sm text-muted-foreground">{room.room_name}</p>
                    )}
                  </div>
                  <Badge
                    variant={room.status === "Occupied" ? "default" : "secondary"}
                  >
                    {room.status}
                  </Badge>
                </div>

                {room.room_type && (
                  <p className="text-sm text-muted-foreground mb-1">
                    Type: {room.room_type}
                  </p>
                )}

                {room.floor && (
                  <p className="text-sm text-muted-foreground mb-1">
                    Floor: {room.floor}
                  </p>
                )}

                {room.guest_name && (
                  <p className="text-sm font-medium mt-2">
                    Guest: {room.guest_name}
                  </p>
                )}

                {room.customer_name && (
                  <p className="text-sm text-muted-foreground">
                    Customer: {room.customer_name}
                  </p>
                )}

                {!room.customer && (
                  <p className="text-sm text-destructive mt-2">
                    No customer assigned
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoomsModal;
