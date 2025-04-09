'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { locationService } from '@/services/location.service';
import type { Location } from '@/types';
import { Pagination } from '@/components/ui/pagination';

export default function AdminLocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [allLocations, setAllLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    tenViTri: '',
    tinhThanh: '',
    quocGia: '',
    hinhAnh: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const handleFilterLocations = useCallback(() => {
    let filteredLocations = allLocations;

    if (searchTerm) {
      filteredLocations = allLocations.filter(location =>
        location.tenViTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.tinhThanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.quocGia.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedLocations = filteredLocations.slice(startIndex, startIndex + itemsPerPage);
    setLocations(paginatedLocations);
  }, [allLocations, searchTerm, currentPage]);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    handleFilterLocations();
  }, [handleFilterLocations]);

  const fetchLocations = async () => {
    try {
      const response = await locationService.getLocations();
      setAllLocations(response.content);
    } catch (err: any) {
      toast.error(err?.message || 'Không thể tải danh sách địa điểm');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        await locationService.updateLocation(editingLocation.id, formData);
        toast.success('Cập nhật địa điểm thành công!');
      } else {
        await locationService.createLocation(formData);
        toast.success('Thêm địa điểm thành công!');
      }

      setIsModalOpen(false);
      setEditingLocation(null);
      setFormData({
        tenViTri: '',
        tinhThanh: '',
        quocGia: '',
        hinhAnh: '',
      });
      fetchLocations();
    } catch (err: any) {
      toast.error(err?.message || (editingLocation ? 'Không thể cập nhật địa điểm' : 'Không thể thêm địa điểm'));
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      tenViTri: location.tenViTri,
      tinhThanh: location.tinhThanh,
      quocGia: location.quocGia,
      hinhAnh: location.hinhAnh,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) return;

    try {
      await locationService.deleteLocation(id);
      toast.success('Xóa địa điểm thành công!');
      fetchLocations();
    } catch (err: any) {
      toast.error(err?.message || 'Không thể xóa địa điểm');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(
    (searchTerm ? allLocations.filter(location =>
      location.tenViTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.tinhThanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.quocGia.toLowerCase().includes(searchTerm.toLowerCase())
    ).length : allLocations.length) / itemsPerPage
  );

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
        <div className="sm:flex-auto text-center ml-60">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Quản lý địa điểm</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Danh sách tất cả địa điểm trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingLocation(null);
              setFormData({
                tenViTri: '',
                tinhThanh: '',
                quocGia: '',
                hinhAnh: '',
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 sm:w-auto cursor-pointer"
          >
            Thêm địa điểm
          </button>
        </div>
      </div>

      <div className="mt-4 flex space-x-4">
        <div className="flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm kiếm theo tên địa điểm..."
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-[#1D1D1D] dark:border-[#383838] dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>

      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg dark:ring-[#383838]">
              <table className="min-w-full divide-y divide-gray-300 dark:divide-[#383838]">
                <thead className="bg-gray-50 dark:bg-[#1D1D1D]">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
                      Địa điểm
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Tỉnh/Thành phố
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Quốc gia
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white dark:bg-[#121212] dark:divide-[#383838]">
                  {locations.map((location) => (
                    <tr key={location.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <Image
                              width={40}
                              height={40}
                              className="h-10 w-10 rounded object-cover"
                              src={location.hinhAnh || '/placeholder.jpg'}
                              alt={location.tenViTri}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">{location.tenViTri}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {location.tinhThanh}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-300">
                        {location.quocGia}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          type="button"
                          onClick={() => handleEdit(location)}
                          className="text-primary hover:text-primary-hover mr-4 cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(location.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer"
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

      {/* Phân trang */}
      {totalPages > 1 && (
        <Pagination 
          currentPage={currentPage} 
          totalPages={totalPages} 
          onPageChange={handlePageChange} 
        />
      )}

      {/* Modal thêm/sửa địa điểm */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-[#1D1D1D] rounded-lg shadow-lg w-full max-w-md mx-auto p-6">
            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
              {editingLocation ? 'Cập nhật địa điểm' : 'Thêm địa điểm mới'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="tenViTri" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tên địa điểm
                </label>
                <input
                  type="text"
                  id="tenViTri"
                  value={formData.tenViTri}
                  onChange={(e) => setFormData({ ...formData, tenViTri: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-[#121212] dark:border-[#383838] dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="tinhThanh" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tỉnh/Thành phố
                </label>
                <input
                  type="text"
                  id="tinhThanh"
                  value={formData.tinhThanh}
                  onChange={(e) => setFormData({ ...formData, tinhThanh: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-[#121212] dark:border-[#383838] dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="quocGia" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Quốc gia
                </label>
                <input
                  type="text"
                  id="quocGia"
                  value={formData.quocGia}
                  onChange={(e) => setFormData({ ...formData, quocGia: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-[#121212] dark:border-[#383838] dark:text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="hinhAnh" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  URL hình ảnh
                </label>
                <input
                  type="text"
                  id="hinhAnh"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-[#121212] dark:border-[#383838] dark:text-white"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-[#2A2A2A] dark:border-[#383838] hover:bg-gray-50 dark:hover:bg-[#383838] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  {editingLocation ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
