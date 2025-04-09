"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Room, Review } from "@/types";
import { roomService } from "@/services/room.service";
import { reviewService } from "@/services/review.service";
import { getValidImageUrl } from "@/utils/image";
import BookingForm from "@/components/booking/booking-form";
import ReviewForm from "@/components/review/review-form";
import { useAuth } from "@/hooks/use-auth";
import {
  Wifi,
  Tv,
  Utensils,
  Car,
  Droplet,
  Wind,
  ShowerHead,
  Bed,
  Users,
  MapPin,
  ArrowLeft,
  Star,
  WashingMachine,
  UserCircle,
  Calendar,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useFavorites } from '@/contexts/favorites.context';
import { animateElement, AnimationTypes } from '@/utils/animation';
import { Pagination } from '@/components/ui/pagination';

export default function RoomDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const [room, setRoom] = useState<Room | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews: Review[]) => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.saoBinhLuan, 0);
    return (sum / reviews.length).toFixed(1);
  };

  useEffect(() => {
    const fetchRoomDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch room data
        const roomResponse = await roomService.getRoomById(Number(id));
        if (!roomResponse?.content) {
          throw new Error("Không tìm thấy thông tin phòng");
        }
        const roomData = roomResponse.content;
        setRoom(roomData);

        // Prepare gallery images
        const mainImage = getValidImageUrl(roomData.hinhAnh, "room");
        const images = [mainImage];
        if (roomData.hinhPhong) {
          const additionalImages = Array.isArray(roomData.hinhPhong)
            ? roomData.hinhPhong
            : [roomData.hinhPhong];
          images.push(
            ...additionalImages.map((img: string) =>
              getValidImageUrl(img, "room")
            )
          );
        }
        setGalleryImages(images);

        // Fetch reviews
        try {
          const reviewsResponse = await reviewService.getReviewsByRoom(
            Number(id)
          );
          if (reviewsResponse?.content) {
            // Sắp xếp reviews theo thời gian mới nhất
            const sortedReviews = reviewsResponse.content.sort(
              (a, b) =>
                new Date(b.ngayBinhLuan).getTime() -
                new Date(a.ngayBinhLuan).getTime()
            );
            setReviews(sortedReviews);
          }
        } catch (error) {
          console.error("Error fetching reviews:", error);
          setError("Không thể tải đánh giá. Vui lòng thử lại sau.");
        }
      } catch (error) {
        console.error("Error fetching room details:", error);
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomDetail();
  }, [id]);

  // Thêm useEffect để xử lý lọc reviews và phân trang
  useEffect(() => {
    let filtered = reviews;
    
    // Lọc theo rating nếu có
    if (selectedRating !== null) {
      filtered = reviews.filter(
        (review) => Math.floor(review.saoBinhLuan) === selectedRating
      );
    }
    
    setFilteredReviews(filtered);
    // Reset về trang 1 khi thay đổi bộ lọc
    setCurrentPage(1);
  }, [reviews, selectedRating]);

  // Xử lý phân trang
  const paginatedReviews = useCallback(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredReviews.slice(startIndex, endIndex);
  }, [filteredReviews, currentPage, itemsPerPage]);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);

  // Hàm xử lý chuyển trang
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Cuộn lên đầu phần đánh giá
    const reviewsSection = document.getElementById('reviews-section');
    if (reviewsSection) {
      reviewsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hàm xử lý yêu thích
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    if (!user) {
      toast.error('Bạn cần đăng nhập để sử dụng tính năng yêu thích');
      return;
    }
    
    if (!room) return;
    
    const button = e.currentTarget as HTMLButtonElement;
    
    if (isFavorite(room.id, 'room')) {
      animateElement(button, AnimationTypes.BOUNCE).then(() => {
        removeFavorite(room.id, 'room');
        toast.success(`Đã xóa "${room.tenPhong}" khỏi danh sách yêu thích`);
      });
    } else {
      animateElement(button, AnimationTypes.HEART_BEAT);
      addFavorite(room.id, 'room');
      toast.success(`Đã thêm "${room.tenPhong}" vào danh sách yêu thích`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">Đã xảy ra lỗi</h1>
        <p className="mt-2 text-gray-600">
          {error === "Không tìm thấy thông tin phòng"
            ? "Phòng này không tồn tại hoặc đã bị xóa khỏi hệ thống"
            : error}
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900">
          Không tìm thấy phòng
        </h1>
        <p className="mt-2 text-gray-600">
          Phòng này không tồn tại hoặc đã bị xóa khỏi hệ thống. Vui lòng kiểm
          tra lại đường dẫn hoặc chọn một phòng khác.
        </p>
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </button>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  // Tính toán average rating
  const averageRating = calculateAverageRating(reviews);

  // Lấy danh sách tiện nghi
  const amenities = [
    { name: "Wifi", value: room.wifi, icon: Wifi },
    { name: "TV", value: room.tivi, icon: Tv },
    { name: "Bếp", value: room.bep, icon: Utensils },
    { name: "Bãi đỗ xe", value: room.doXe, icon: Car },
    { name: "Điều hòa", value: room.dieuHoa, icon: Wind },
    { name: "Máy giặt", value: room.mayGiat, icon: WashingMachine },
    { name: "Bàn ủi", value: room.banUi, icon: Droplet },
    { name: "Hồ bơi", value: room.hoBoi, icon: Droplet },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Quay lại
      </button>

      {/* Room title */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">{room.tenPhong}</h1>
          <button
            onClick={handleFavoriteToggle}
            className="p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            aria-label="Yêu thích"
          >
            <Heart
              className={`h-6 w-6 ${
                isFavorite(room.id, "room")
                  ? "text-rose-600 fill-current"
                  : "text-gray-400"
              }`}
            />
          </button>
        </div>
        <div className="flex items-center mt-2 text-gray-600">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{room.diaChi || "Chưa cập nhật địa chỉ"}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Gallery */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
            <div className="relative h-80">
              <Image
                src={galleryImages[0] || "/placeholder.jpg"}
                alt={room.tenPhong}
                fill
                className="object-cover"
                priority
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-4">
                {galleryImages.slice(1, 5).map((image, index) => (
                  <div key={index} className="relative h-20">
                    <Image
                      src={image}
                      alt={`${room.tenPhong} - ${index + 2}`}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Room info */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 animate__animated animate__fadeInLeft animate__delay-2s">
            <div className="flex items-center justify-between pb-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Thông tin phòng
                </h2>
                <div className="flex items-center mt-2 text-gray-600">
                  <div className="flex items-center mr-4">
                    <Users className="h-5 w-5 mr-2" />
                    <span>{room.khach} khách</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <Bed className="h-5 w-5 mr-2" />
                    <span>{room.phongNgu} phòng ngủ</span>
                  </div>
                  <div className="flex items-center">
                    <ShowerHead className="h-5 w-5 mr-2" />
                    <span>{room.phongTam} phòng tắm</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-rose-600">
                  ${room.giaTien.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">mỗi đêm</div>
              </div>
            </div>

            {/* Thông tin chi tiết */}
            <div className="py-6 border-b animate__animated animate__fadeIn animate__delay-3s">
              <h3 className="text-lg font-semibold mb-4">Chi tiết phòng</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <MapPin className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Địa chỉ:</span>
                      <p className="text-gray-600">
                        {room.diaChi || "Chưa cập nhật"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Sức chứa:</span>
                      <p className="text-gray-600">Tối đa {room.khach} khách</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Star className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Đánh giá:</span>
                      <p className="text-gray-600">
                        {averageRating} sao ({reviews.length} đánh giá)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Bed className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Phòng ngủ:</span>
                      <p className="text-gray-600">{room.phongNgu} phòng</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <ShowerHead className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Phòng tắm:</span>
                      <p className="text-gray-600">{room.phongTam} phòng</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <div>
                      <span className="font-medium">Thời gian nhận phòng:</span>
                      <p className="text-gray-600">14:00 - 22:00</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="py-6 border-b">
              <h3 className="text-lg font-semibold mb-4">Mô tả</h3>
              <div className="prose prose-sm max-w-none text-gray-600">
                {room.moTa ? (
                  <p className="whitespace-pre-line">{room.moTa}</p>
                ) : (
                  <p className="text-gray-500 italic">Chưa có mô tả</p>
                )}
              </div>
            </div>

            {/* Tiện nghi */}
            <div className="py-6">
              <h3 className="text-lg font-semibold mb-4">Tiện nghi</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className={`flex items-center ${
                      amenity.value
                        ? "text-gray-900"
                        : "text-gray-400 line-through"
                    }`}
                  >
                    <amenity.icon className="h-5 w-5 mr-3 flex-shrink-0" />
                    <span className="text-sm">{amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div id="reviews-section" className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Đánh giá</h2>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-amber-500 fill-current mr-1" />
                <span className="text-lg font-semibold mr-1">
                  {averageRating}
                </span>
                <span className="text-gray-600">
                  ({reviews.length} đánh giá)
                </span>
              </div>
            </div>

            {/* Rating stats */}
            <div className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = reviews.filter(
                    (r) => Math.floor(r.saoBinhLuan) === stars
                  ).length;
                  const percentage =
                    reviews.length > 0 ? (count / reviews.length) * 100 : 0;

                  return (
                    <div key={stars} className="flex items-center">
                      <div className="w-12 text-sm text-gray-600">
                        {stars} sao
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="h-2 rounded-full bg-gray-200">
                          <div
                            className="h-2 rounded-full bg-amber-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                      <div className="w-12 text-sm text-gray-600 text-right">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {user ? (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name.trim()
                        )}`
                      }
                      alt={user.name}
                      fill
                      sizes="40px"
                      className="object-cover"
                      unoptimized={
                        !user.avatar || user.avatar.includes("ui-avatars.com")
                      }
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      Chia sẻ trải nghiệm của bạn
                    </h3>
                    <p className="text-sm text-gray-600">
                      Đánh giá của bạn sẽ giúp ích cho những người khác
                    </p>
                  </div>
                </div>
                <ReviewForm
                  roomId={room.id}
                  userId={user.id}
                  onSuccess={() => {
                    toast.success("Gửi đánh giá thành công!");
                    // Refresh reviews
                    reviewService.getReviewsByRoom(room.id).then((response) => {
                      if (response?.content) {
                        setReviews(response.content);
                      }
                    });
                  }}
                  onError={() => toast.error("Không thể gửi đánh giá")}
                />
              </div>
            ) : (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-100 text-center">
                <UserCircle className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  Vui lòng đăng nhập để chia sẻ trải nghiệm của bạn
                </p>
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Đăng nhập
                </Link>
              </div>
            )}

            {/* Filter options */}
            <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedRating(null)}
                className={`px-4 py-2 rounded-full border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                  selectedRating === null
                    ? "border-rose-500 bg-rose-50 text-rose-600"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                Tất cả
              </button>
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                    selectedRating === rating
                      ? "border-rose-500 bg-rose-50 text-rose-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {rating}{" "}
                  <Star className="h-3 w-3 ml-1 text-amber-500 fill-current" />
                  <span className="ml-1 text-gray-500">
                    (
                    {
                      reviews.filter(
                        (r) => Math.floor(r.saoBinhLuan) === rating
                      ).length
                    }
                    )
                  </span>
                </button>
              ))}
            </div>

            {/* Reviews list */}
            <div className="space-y-6">
              {reviews.length > 0 ? (
                <>
                  {filteredReviews.length > 0 ? (
                    <div className="space-y-6">
                      {paginatedReviews().map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-100 pb-6 last:border-0"
                        >
                          <div className="flex items-start">
                            <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                              <Image
                                src={
                                  review.avatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    review.tenNguoiBinhLuan || "User"
                                  )}`
                                }
                                alt={review.tenNguoiBinhLuan || "User"}
                                fill
                                sizes="40px"
                                className="object-cover"
                                unoptimized={
                                  !review.avatar ||
                                  review.avatar.includes("ui-avatars.com")
                                }
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold">
                                  {review.tenNguoiBinhLuan ||
                                    "Người dùng ẩn danh"}
                                </h4>
                                <span className="text-sm text-gray-500">
                                  {new Date(
                                    review.ngayBinhLuan
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              </div>
                              <div className="flex items-center mt-1">
                                {[...Array(5)].map((_, index) => (
                                  <Star
                                    key={index}
                                    className={`h-4 w-4 ${
                                      index < Math.floor(review.saoBinhLuan)
                                        ? "text-amber-500 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="mt-2 text-gray-600">
                                {review.noiDung}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>Không có đánh giá nào {selectedRating} sao</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Chưa có đánh giá nào</p>
                  {user && (
                    <p className="mt-2">
                      Hãy là người đầu tiên đánh giá phòng này!
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking form */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="bg-white rounded-xl shadow-md p-6 overflow-hidden">
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xl font-bold">
                    ${room.giaTien}{" "}
                    <span className="text-sm text-gray-500 font-normal">
                      / đêm
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-500 fill-current mr-1" />
                    <span className="text-sm font-medium">{averageRating}</span>
                  </div>
                </div>
              </div>
              <BookingForm
                roomId={room.id}
                price={room.giaTien}
                maxGuests={room.khach}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
