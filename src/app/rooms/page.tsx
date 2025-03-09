import { Suspense } from 'react';
import { getRooms } from '@/services/room';
import { getLocations } from '@/services/location';
import RoomCard from '@/components/home/roomCard';
import { Room } from '@/types/room';

interface RoomsPageProps {
  searchParams: {
    location?: string;
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }
}

async function getFilteredRooms(params: any) {
  try {
    const data = await getRooms(params);
    return data.content || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

// Hàm lấy danh sách địa điểm
async function getAllLocations() {
  try {
    const data = await getLocations();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  const rooms = await getFilteredRooms(searchParams);
  const locations = await getAllLocations();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {searchParams.location 
          ? `Chỗ ở tại ${searchParams.location}`
          : 'Tất cả chỗ ở'
        }
      </h1>

      {/* Dropdown chọn địa điểm */}
      <div className="mb-6">
        <label htmlFor="location" className="block text-lg font-medium mb-2">Chọn địa điểm:</label>
        <select
          id="location"
          name="location"
          className="border p-2 rounded w-full"
          defaultValue={searchParams.location || ''}
        >
          <option value="">Tất cả địa điểm</option>
          {locations.map((loc: { id: number; name: string }) => (
            <option key={loc.id} value={loc.name}>{loc.name}</option>
          ))}
        </select>
      </div>

      {rooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <Suspense fallback={<div>Đang tải...</div>}>
            {rooms.map((room: Room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </Suspense>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Không tìm thấy chỗ ở phù hợp</h2>
          <p className="text-gray-600 mb-8">Hãy thử điều chỉnh tiêu chí tìm kiếm của bạn.</p>
        </div>
      )}
    </div>
  );
}
