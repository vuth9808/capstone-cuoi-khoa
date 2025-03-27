'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { roomService } from '@/services/room.service';
import { locationService } from '@/services/location.service';
import { useAuthStore } from '@/store/auth.store';
import type { Room, Location } from '@/types';

export default function AdminRoomsPage() {
  const { user } = useAuthStore();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({
    tenPhong: '',
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: '',
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 0,
    maNguoiDung: user?.id || 0,
    hinhAnh: '',
  });

  useEffect(() => {
    fetchRooms();
    fetchLocations();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await roomService.getRooms();
      setRooms(response.content);
    } catch {
      toast.error('Không thể tải danh sách phòng');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await locationService.getLocations();
      setLocations(response.content);
    } catch {
      toast.error('Không thể tải danh sách địa điểm');
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRooms();
      return;
    }

    try {
      setIsLoading(true);
      const filteredRooms = rooms.filter(room =>
        room.tenPhong.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.moTa.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setRooms(filteredRooms);
    } catch {
      toast.error('Không thể tìm kiếm phòng');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingRoom) {
        await roomService.updateRoom(editingRoom.id, formData);
        toast.success('Cập nhật phòng thành công!');
      } else {
        const roomData = {
          ...formData,
          maNguoiDung: user?.id || 0
        };
        await roomService.createRoom(roomData);
        toast.success('Thêm phòng thành công!');
      }
      
      setIsModalOpen(false);
      setEditingRoom(null);
      setFormData({
        tenPhong: '',
        khach: 1,
        phongNgu: 1,
        giuong: 1,
        phongTam: 1,
        moTa: '',
        giaTien: 0,
        mayGiat: false,
        banLa: false,
        tivi: false,
        dieuHoa: false,
        wifi: false,
        bep: false,
        doXe: false,
        hoBoi: false,
        banUi: false,
        maViTri: 0,
        maNguoiDung: user?.id || 0,
        hinhAnh: '',
      });
      fetchRooms();
    } catch {
      toast.error(editingRoom ? 'Không thể cập nhật phòng' : 'Không thể thêm phòng');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      tenPhong: room.tenPhong,
      khach: room.khach,
      phongNgu: room.phongNgu,
      giuong: room.giuong,
      phongTam: room.phongTam,
      moTa: room.moTa,
      giaTien: room.giaTien,
      mayGiat: room.mayGiat,
      banLa: room.banLa,
      tivi: room.tivi,
      dieuHoa: room.dieuHoa,
      wifi: room.wifi,
      bep: room.bep,
      doXe: room.doXe,
      hoBoi: room.hoBoi,
      banUi: room.banUi,
      maViTri: room.maViTri,
      maNguoiDung: room.maNguoiDung,
      hinhAnh: room.hinhAnh,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa phòng này?')) {
      return;
    }

    try {
      await roomService.deleteRoom(id);
      toast.success('Xóa phòng thành công!');
      fetchRooms();
    } catch {
      toast.error('Không thể xóa phòng');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto text-center ml-40">
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý phòng</h1>
          <p className="mt-2 text-sm text-gray-700">
            Danh sách tất cả phòng trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingRoom(null);
              setFormData({
                tenPhong: '',
                khach: 1,
                phongNgu: 1,
                giuong: 1,
                phongTam: 1,
                moTa: '',
                giaTien: 0,
                mayGiat: false,
                banLa: false,
                tivi: false,
                dieuHoa: false,
                wifi: false,
                bep: false,
                doXe: false,
                hoBoi: false,
                banUi: false,
                maViTri: 0,
                maNguoiDung: user?.id || 0,
                hinhAnh: '',
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
          >
            Thêm phòng
          </button>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên phòng..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Phòng
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Địa điểm
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Giá tiền
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Sức chứa
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {rooms.map((room) => (
                    <tr key={room.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded object-cover"
                              src={room.hinhAnh || '/placeholder.jpg'}
                              alt={room.tenPhong}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{room.tenPhong}</div>
                            <div className="text-gray-500 text-sm line-clamp-1">{room.moTa}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {locations.find(l => l.id === room.maViTri)?.tenViTri || 'N/A'}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {room.giaTien.toLocaleString('vi-VN')}đ/đêm
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {room.khach} khách • {room.phongNgu} phòng ngủ • {room.phongTam} phòng tắm
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => handleEdit(room)}
                          className="text-primary-600 hover:text-primary-900 mr-4"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(room.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
              {editingRoom ? 'Sửa phòng' : 'Thêm phòng mới'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="tenPhong" className="block text-sm font-medium text-gray-700">
                    Tên phòng
                  </label>
                  <input
                    type="text"
                    id="tenPhong"
                    value={formData.tenPhong}
                    onChange={(e) => setFormData({ ...formData, tenPhong: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="maViTri" className="block text-sm font-medium text-gray-700">
                    Địa điểm
                  </label>
                  <select
                    id="maViTri"
                    value={formData.maViTri}
                    onChange={(e) => setFormData({ ...formData, maViTri: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  >
                    <option value="">Chọn địa điểm</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.tenViTri}, {location.tinhThanh}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="giaTien" className="block text-sm font-medium text-gray-700">
                    Giá tiền (VNĐ/đêm)
                  </label>
                  <input
                    type="number"
                    id="giaTien"
                    value={formData.giaTien}
                    onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label htmlFor="hinhAnh" className="block text-sm font-medium text-gray-700">
                    URL hình ảnh
                  </label>
                  <input
                    type="url"
                    id="hinhAnh"
                    value={formData.hinhAnh}
                    onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="moTa" className="block text-sm font-medium text-gray-700">
                    Mô tả
                  </label>
                  <textarea
                    id="moTa"
                    value={formData.moTa}
                    onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="khach" className="block text-sm font-medium text-gray-700">
                      Số khách
                    </label>
                    <input
                      type="number"
                      id="khach"
                      value={formData.khach}
                      onChange={(e) => setFormData({ ...formData, khach: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="phongNgu" className="block text-sm font-medium text-gray-700">
                      Số phòng ngủ
                    </label>
                    <input
                      type="number"
                      id="phongNgu"
                      value={formData.phongNgu}
                      onChange={(e) => setFormData({ ...formData, phongNgu: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="giuong" className="block text-sm font-medium text-gray-700">
                      Số giường
                    </label>
                    <input
                      type="number"
                      id="giuong"
                      value={formData.giuong}
                      onChange={(e) => setFormData({ ...formData, giuong: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label htmlFor="phongTam" className="block text-sm font-medium text-gray-700">
                      Số phòng tắm
                    </label>
                    <input
                      type="number"
                      id="phongTam"
                      value={formData.phongTam}
                      onChange={(e) => setFormData({ ...formData, phongTam: Number(e.target.value) })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      required
                      min="1"
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Tiện nghi</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.mayGiat}
                        onChange={(e) => setFormData({ ...formData, mayGiat: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Máy giặt</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.banLa}
                        onChange={(e) => setFormData({ ...formData, banLa: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bàn là</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.tivi}
                        onChange={(e) => setFormData({ ...formData, tivi: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">TV</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.dieuHoa}
                        onChange={(e) => setFormData({ ...formData, dieuHoa: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Điều hòa</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.wifi}
                        onChange={(e) => setFormData({ ...formData, wifi: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Wifi</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.bep}
                        onChange={(e) => setFormData({ ...formData, bep: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bếp</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.doXe}
                        onChange={(e) => setFormData({ ...formData, doXe: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bãi đỗ xe</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.hoBoi}
                        onChange={(e) => setFormData({ ...formData, hoBoi: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Hồ bơi</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.banUi}
                        onChange={(e) => setFormData({ ...formData, banUi: e.target.checked })}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Bàn ủi</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  {editingRoom ? 'Cập nhật' : 'Thêm'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
