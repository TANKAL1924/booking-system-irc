import { supabase } from '@/lib/supabase';

export interface PaymentMethod {
  id: number;
  method: string;
  type: 'QR' | 'Direct Transfer' | 'FPX' | 'Cash' | 'Other';
  accountName: string;
  accountNumber: string;
  bankName: string;
  details: string;
  enabled: boolean;
}

export type PaymentMethodPayload = Omit<PaymentMethod, 'id'>;

// TODO: replace table/column names to match your Supabase schema
export async function fetchPaymentMethods(): Promise<PaymentMethod[]> {
  const { data, error } = await supabase.from('payment_method').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as PaymentMethod[];
}

export async function createPaymentMethod(payload: PaymentMethodPayload): Promise<void> {
  const { error } = await supabase.from('payment_method').insert(payload);
  if (error) throw new Error(error.message);
}

export async function updatePaymentMethod(id: number, payload: PaymentMethodPayload): Promise<void> {
  const { error } = await supabase.from('payment_method').update(payload).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deletePaymentMethod(id: number): Promise<void> {
  const { error } = await supabase.from('payment_method').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
