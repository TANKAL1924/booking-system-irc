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

const PAGE_SIZE = 50;

export async function fetchBookings(page = 0): Promise<{ data: Booking[]; hasMore: boolean }> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const { data, error } = await supabase
    .from('booking')
    .select('*, booking_item(*)')
    .order('created_at', { ascending: false })
    .range(from, to);
  if (error) throw new Error(error.message);
  const list = (data ?? []) as Booking[];
  return { data: list, hasMore: list.length === PAGE_SIZE };
}

export async function updateBookingStatus(id: number, status: boolean): Promise<void> {
  const { error } = await supabase.from('booking').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBooking(id: number): Promise<void> {
  const { error } = await supabase.from('booking').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export interface CreateAdminBookingPayload {
  customer_name: string;
  phone: string;
  email: string;
  payment_type: boolean; // true = full, false = deposit
  total_amount: number;
  items: {
    facility_id: number;
    facility_name: string;
    date: string;
    time_start: string;
    time_end: string;
    slot_price: number;
    add_ons: BookingAddOn[];
    item_amount: number;
  }[];
}

export async function createAdminBooking(payload: CreateAdminBookingPayload): Promise<void> {
  const { data: bookingRow, error: bookingErr } = await supabase
    .from('booking')
    .insert({
      customer_name: payload.customer_name,
      phone: payload.phone,
      email: payload.email,
      payment_type: payload.payment_type,
      total_amount: payload.total_amount,
      status: false, // always Paid for admin-created bookings
    })
    .select('id')
    .single();

  if (bookingErr || !bookingRow) throw new Error(bookingErr?.message ?? 'Failed to create booking');

  const items = payload.items.map((item) => ({
    booking_id: bookingRow.id,
    ...item,
  }));

  const { error: itemsErr } = await supabase.from('booking_item').insert(items);
  if (itemsErr) throw new Error(itemsErr.message);
}

export async function upgradeDepositToFull(id: number, currentAmount: number): Promise<void> {
  const fullAmount = currentAmount * 2;
  const { error } = await supabase
    .from('booking')
    .update({ payment_type: true, total_amount: fullAmount })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
