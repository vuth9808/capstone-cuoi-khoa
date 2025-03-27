export type UserRole = 'USER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  phone: string;
  birthday: string;
  avatar: string;
  gender: boolean;
  role: UserRole;
  address?: string;
}

export interface Location {
  id: number;
  tenViTri: string;
  tinhThanh: string;
  quocGia: string;
  hinhAnh: string;
}

export interface Room {
  id: number;
  tenPhong: string;
  khach: number;
  phongNgu: number;
  giuong: number;
  phongTam: number;
  moTa: string;
  giaTien: number;
  mayGiat: boolean;
  banLa: boolean;
  tivi: boolean;
  dieuHoa: boolean;
  wifi: boolean;
  bep: boolean;
  doXe: boolean;
  hoBoi: boolean;
  banUi: boolean;
  maNguoiDung: number;
  maViTri: number;
  hinhAnh: string;
  hinhPhong?: string | string[];
  diaChi?: string;
}

export interface Booking {
  id: number;
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
  ngayDat?: string;
  trangThai?: 'pending' | 'confirmed' | 'cancelled';
}

export interface CreateBookingDto {
  maPhong: number;
  ngayDen: string;
  ngayDi: string;
  soLuongKhach: number;
  maNguoiDung: number;
}

export interface Review {
  id: number;
  maPhong: number;
  maNguoiBinhLuan: number;
  ngayBinhLuan: string;
  noiDung: string;
  saoBinhLuan: number;
  avatar?: string;
  tenNguoiBinhLuan?: string;
}

export interface CreateReviewDto {
  maPhong: number;
  maNguoiBinhLuan: number;
  noiDung: string;
  saoBinhLuan: number;
  ngayBinhLuan: string;
}

export interface ApiResponse<T> {
  statusCode: number;
  content: T;
  dateTime: string;
  message: string;
}
