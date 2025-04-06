"use client";

import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  Hotel,
  Compass,
  ArrowRight,
  Heart,
  ArrowLeft,
} from "lucide-react";
import { locationService } from "@/services/location.service";
import { Location } from "@/types";
import { getValidImageUrl } from "@/utils/image";
import { ApiResponse } from "@/config/axios.config";
import { useFavorites } from "@/contexts/favorites.context";
import { toast } from "react-hot-toast";
import { useAuthStore } from "@/store/auth.store";
import { animateElement, AnimationTypes } from "@/utils/animation";

export default function LocationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const { user } = useAuthStore();

  const { data: locationsData, isLoading } = useQuery<ApiResponse<Location[]>>({
    queryKey: ["locations"],
    queryFn: () => locationService.getLocations(),
  });

  const locations = useMemo(() => locationsData?.content || [], [locationsData]);

  // Get unique countries for filter
  const countries = Array.from(
    new Set(locations.map((loc) => loc.quocGia))
  ).sort();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (locations) {
      let filtered = [...locations];

      // Apply country filter
      if (filterCountry) {
        filtered = filtered.filter(
          (loc) => loc.quocGia.toLowerCase() === filterCountry.toLowerCase()
        );
      }

      // Apply search term
      if (searchTerm) {
        filtered = filtered.filter(
          (loc) =>
            loc.tenViTri.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.tinhThanh.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.quocGia.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setFilteredLocations(filtered);
    }
  }, [locations, searchTerm, filterCountry]);

  const handleFavoriteToggle = (e: React.MouseEvent, location: Location) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng yêu thích');
      return;
    }
    
    const button = e.currentTarget as HTMLButtonElement;
    
    if (isFavorite(location.id, "location")) {
      animateElement(button, AnimationTypes.BOUNCE).then(() => {
        removeFavorite(location.id, "location");
        toast.success(`Đã xóa ${location.tenViTri} khỏi danh sách yêu thích`);
      });
    } else {
      animateElement(button, AnimationTypes.HEART_BEAT);
      addFavorite(location.id, "location");
      toast.success(`Đã thêm ${location.tenViTri} vào danh sách yêu thích`);
    }
  };

  // Loading state
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airbnb-rosa"></div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero section */}
      <div className="relative h-80 md:h-96 bg-gradient-to-r from-airbnb-rosa to-airbnb-kazan overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://a0.muscache.com/im/pictures/miso/Hosting-51809333/original/0da70267-d9da-4efb-9123-2714b651c9fd.jpeg"
            alt="Travel destinations"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 animate__animated animate__fadeInDown">
            Khám phá các điểm đến tuyệt vời
          </h1>
          <p className="text-xl text-white max-w-2xl animate__animated animate__fadeInUp animate__delay-1s">
            Tìm kiếm và khám phá các địa điểm thú vị cho chuyến đi tiếp theo của
            bạn
          </p>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg -mt-10 md:-mt-12 relative z-10 p-4 md:p-6 animate__animated animate__fadeInUp animate__delay-1s">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm kiếm địa điểm..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-airbnb-rosa focus:border-airbnb-rosa sm:text-sm"
              />
            </div>
            <div className="md:w-1/4">
              <select
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-airbnb-rosa focus:border-airbnb-rosa sm:text-sm rounded-md"
              >
                <option value="">Tất cả quốc gia</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results section */}
        <div className="py-8">
          <div className="container mx-auto px-4 mb-6">
            <div className="flex justify-between items-center animate__animated animate__fadeIn animate__delay-2s">
              <button
                onClick={() => router.back()}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </button>
              <h2 className="text-2xl font-bold text-airbnb-hof absolute left-1/2 transform -translate-x-1/2">
                {filteredLocations.length}{" "}
                {filteredLocations.length === 1 ? "địa điểm" : "địa điểm"}
                {filterCountry && ` tại ${filterCountry}`}
                {searchTerm && ` phù hợp với "${searchTerm}"`}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location, index) => (
              <div key={location.id} className={`group relative animate__animated animate__fadeIn animate__delay-${index % 5}s`}>
                <Link
                  href={`/rooms?locationId=${location.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                    <Image
                      src={
                        getValidImageUrl(location.hinhAnh, "location") ||
                        "https://picsum.photos/400/300"
                      }
                      alt={location.tenViTri}
                      fill
                      priority={filteredLocations.indexOf(location) === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized={!location.hinhAnh}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                  </div>
                  <h3 className="font-bold text-lg text-airbnb-hof group-hover:text-airbnb-rosa transition-colors">
                    {location.tenViTri}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">
                      {location.tinhThanh}, {location.quocGia}
                    </span>
                  </div>
                  <div className="mt-3 text-airbnb-rosa font-medium text-sm flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem danh sách phòng <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </Link>
                <button
                  onClick={(e) => handleFavoriteToggle(e, location)}
                  className="absolute top-3 right-3 z-10 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:scale-110 transition-all duration-200 hover:shadow-lg active:scale-95"
                  aria-label={
                    isFavorite(location.id, "location")
                      ? "Xóa khỏi yêu thích"
                      : "Thêm vào yêu thích"
                  }
                >
                  <Heart
                    className={`h-5 w-5 transition-all duration-200 ${
                      isFavorite(location.id, "location")
                        ? "text-red-500 fill-red-500 scale-110"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-airbnb-foggy mb-4">
                <Compass className="h-8 w-8 text-airbnb-rosa" />
              </div>
              <h3 className="text-xl font-medium text-airbnb-hof">
                Không tìm thấy địa điểm nào
              </h3>
              <p className="mt-2 text-gray-500">
                Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterCountry("");
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-airbnb-rosa hover:bg-airbnb-rausch"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Featured destinations section */}
      {filteredLocations.length > 0 && countries.length > 1 && (
        <div className="bg-airbnb-foggy py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-airbnb-hof mb-6">
              Điểm đến nổi bật
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {countries.slice(0, 3).map((country) => {
                const countryLocations = locations.filter(
                  (loc) => loc.quocGia === country
                );
                if (countryLocations.length === 0) return null;

                return (
                  <div
                    key={country}
                    className="bg-white rounded-xl shadow-sm overflow-hidden"
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          getValidImageUrl(
                            countryLocations[0].hinhAnh,
                            "location"
                          ) || "https://picsum.photos/400/300"
                        }
                        alt={country}
                        fill
                        priority={countries.indexOf(country) === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-bold">{country}</h3>
                        <p className="text-sm">
                          {countryLocations.length} địa điểm
                        </p>
                      </div>
                    </div>
                    <div className="p-4">
                      <ul className="divide-y divide-gray-200">
                        {countryLocations.slice(0, 3).map((loc) => (
                          <li key={loc.id} className="py-2">
                            <Link
                              href={`/rooms?locationId=${loc.id}`}
                              className="flex items-center hover:text-airbnb-rosa"
                            >
                              <Hotel className="h-4 w-4 mr-2 text-gray-400" />
                              <span>
                                {loc.tenViTri}, {loc.tinhThanh}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                      {countryLocations.length > 3 && (
                        <Link
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setFilterCountry(country);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="mt-3 text-airbnb-rosa hover:text-airbnb-rausch font-medium text-sm flex items-center"
                        >
                          Xem tất cả {countryLocations.length} địa điểm{" "}
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
