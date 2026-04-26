import { supabase } from '@/lib/supabase';

export type PaymentType = '50% Deposit' | 'Full Payment';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

export interface Booking {
  id: string;
  customerName: string;
  phone: string;
  arena: string;
  date: string;
  timeStart: string;
  timeEnd: string;
  paymentType: PaymentType;
  amount: string;
  status: BookingStatus;
}

// TODO: replace table/column names to match your Supabase schema
export async function fetchBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from('booking').select('*').order('date', { ascending: false });
  if (error) throw new Error(error.message);
  return data as Booking[];
}

export async function updateBookingStatus(id: string, status: BookingStatus): Promise<void> {
  const { error } = await supabase.from('booking').update({ status }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteBooking(id: string): Promise<void> {
  const { error } = await supabase.from('booking').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
