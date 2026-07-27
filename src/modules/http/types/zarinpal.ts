export type ZarinpalRequestData = {
  amount: number;
  description: string;
  metadata?: {
    mobile?: string;
    email?: string;
  };
};
