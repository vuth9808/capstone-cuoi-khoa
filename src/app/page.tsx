import { Suspense } from 'react';
import Hero from '@/components/home/hero';
import SearchBar from '@/components/home/searchBar';
import RoomCard from '@/components/home/roomCard';
import { getRooms } from '@/services/room';
import { getLocations } from '@/services/location';
import { Location } from '@/types/location';
import { Room } from '@/types/room';

async function getFeaturedRooms() {
  try {
    const data = await getRooms();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching rooms:', error);
    return [];
  }
}

async function getPopularLocations() {
  try {
    const data = await getLocations();
    return data.content || [];
  } catch (error) {
    console.error('Error fetching locations:', error);
    return [];
  }
}

export default async function Home() {
  const rooms = await getFeaturedRooms();
  const locations = await getPopularLocations();

  return (
    <div>
      <Hero />
      <div className="container mx-auto px-4">
        <SearchBar />
        
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8">Khám phá những chỗ ở nổi bật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <Suspense fallback={<div>Đang tải...</div>}>
              {rooms.map((room:Room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </Suspense>
          </div>
        </section>
        
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8">Khám phá những địa điểm thú vị</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {locations.map((location:Location) => (
              <div key={location.id} className="group">
                <div className="relative aspect-video overflow-hidden rounded-xl">
                  <img
                    src={location.hinhAnh || '/images/placeholder-location.jpg'}
                    alt={location.tenViTri}
                    className="object-cover group-hover:scale-110 transition h-full w-full"
                  />
                </div>
                <div className="mt-3">
                  <h3 className="font-semibold">{location.tenViTri}</h3>
                  <p className="text-gray-500">{location.tinhThanh}, {location.quocGia}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}