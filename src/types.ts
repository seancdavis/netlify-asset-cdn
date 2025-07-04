export type Upload = {
  id: number;
  filename: string;
  blob_key: string;
  uploaded_at: Date | string;
  metadata: string;
  tags: string;
};
