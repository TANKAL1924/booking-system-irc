import { supabase } from '@/lib/supabase';

// status: false (0) = Paid, true (1) = Cancelled

export interface BookingAddOn {
  name: string;
  price_per_hour: number;
  hours: number;
  subtotal: number;
}

export interface BookingItem {
  id: number;
  facility_id: number;
  facility_name: string;
  date: string;
  time_start: string;
  time_end: string;
  slot_price: number;
  add_ons: BookingAddOn[];
  item_amount: number;
}

export interface Booking {
  id: number;
  customer_name: string;
  phone: string;
  email: string;
  payment_type: boolean;
  total_amount: number;
  status: boolean;
  created_at: string;
  booking_item: BookingItem[];
}

export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('booking')
    .select('*, booking_item(*)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Booking[];
}

export async function updateBookingStatus(id: number, status: boolean): Promise<void> {
  const { error } = await supabase.from('booking').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase.from('booking').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
