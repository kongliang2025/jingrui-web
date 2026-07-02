export interface Evidence {
  _id?: string;
  roomNumber: string;
  contact: string;
  description: string;
  images: string[]; // 存储图片 URL 或 base64
  agreedToDeclaration: boolean;
  status: 'pending' | 'processing' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}
