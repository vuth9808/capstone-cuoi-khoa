'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { register } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SignUpPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthday: '',
    gender: true,
    avatar: '',
    termsAccepted: false
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      termsAccepted: checked
    }));
    
    // Clear error if terms are accepted
    if (checked && errors.termsAccepted) {
      setErrors((prev) => ({
        ...prev,
        termsAccepted: '',
      }));
    }
  };

  const handleGenderChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      gender: value === 'true'
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Kiểm tra kích thước file (giới hạn 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Kích thước file không được vượt quá 5MB'
        }));
        return;
      }
      
      // Kiểm tra định dạng file
      const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          avatar: 'Chỉ chấp nhận file hình ảnh (JPEG, PNG, GIF)'
        }));
        return;
      }
      
      // Trong thực tế, bạn sẽ gửi file này lên server
      // Ở đây chúng ta tạo URL để xem trước hình ảnh
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setFormData(prev => ({
        ...prev,
        avatar: file.name
      }));
      
      // Xóa lỗi nếu có
      if (errors.avatar) {
        setErrors(prev => ({
          ...prev,
          avatar: ''
        }));
      }
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Họ tên là bắt buộc';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Số điện thoại là bắt buộc';
    } else if (!/^0[0-9]{9}$/.test(formData.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (phải bắt đầu bằng số 0 và có 10 chữ số)';
    }
    
    if (!formData.birthday) {
      newErrors.birthday = 'Ngày sinh là bắt buộc';
    } else {
      // Kiểm tra tuổi (ít nhất 16 tuổi)
      const birthDate = new Date(formData.birthday);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (age < 16 || (age === 16 && monthDiff < 0) || (age === 16 && monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        newErrors.birthday = 'Bạn phải từ 16 tuổi trở lên';
      }
    }
    
    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Bạn phải đồng ý với điều khoản và chính sách';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      setRegisterError('');
      
      // Loại bỏ những trường không cần thiết khi gửi lên server
      const { confirmPassword, termsAccepted, ...dataToSubmit } = formData;
      
      // Trong thực tế, bạn sẽ cần xử lý upload ảnh đại diện
      // Ví dụ: tạo FormData và thêm file vào
      
      const result = await register(dataToSubmit);
      
      if (result.success) {
        // Hiển thị thông báo thành công và chuyển hướng sau 2 giây
        setTimeout(() => {
          router.push('/auth/signin?registered=true');
        }, 2000);
      } else {
        setRegisterError('Có lỗi xảy ra khi đăng ký');
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        setRegisterError('Email hoặc số điện thoại đã được sử dụng');
      } else {
        setRegisterError(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng ký tài khoản mới
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link href="/auth/signin" className="font-medium text-rose-600 hover:text-rose-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {registerError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {registerError}
            </div>
          )}
          
          <div className="space-y-4">
            {/* Họ tên */}
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Nhập họ tên đầy đủ"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
            
            {/* Mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
            
            {/* Xác nhận mật khẩu */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
            
            {/* Số điện thoại */}
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                name="phone"
                placeholder="0912345678"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            
            {/* Ngày sinh */}
            <div className="space-y-2">
              <Label htmlFor="birthday">Ngày sinh</Label>
              <Input
                id="birthday"
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className={errors.birthday ? "border-red-500" : ""}
              />
              {errors.birthday && (
                <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
              )}
            </div>
            
            {/* Giới tính */}
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                value={formData.gender.toString()}
                onValueChange={handleGenderChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Nam</SelectItem>
                  <SelectItem value="false">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Ảnh đại diện */}
            <div className="space-y-2">
              <Label htmlFor="avatar">Ảnh đại diện</Label>
              <div className="flex items-center space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Chọn ảnh
                </Button>
                <Input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  // ref={fileInputRef}
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                {formData.avatar && !errors.avatar && (
                  <span className="text-sm text-gray-500">Đã chọn: {formData.avatar}</span>
                )}
              </div>
              
              {avatarPreview && (
                <div className="mt-2">
                  <img 
                    src={avatarPreview} 
                    alt="Xem trước" 
                    className="h-20 w-20 object-cover rounded-full"
                  />
                </div>
              )}
              
              {errors.avatar && (
                <p className="text-red-500 text-sm mt-1">{errors.avatar}</p>
              )}
            </div>
          </div>
          
          {/* Điều khoản */}
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={formData.termsAccepted}
              onCheckedChange={handleCheckboxChange}
            />
            <Label htmlFor="terms" className="text-sm font-medium leading-none">
              Tôi đồng ý với <Link href="/terms" className="text-rose-600 hover:text-rose-500">điều khoản</Link> và <Link href="/privacy" className="text-rose-600 hover:text-rose-500">chính sách bảo mật</Link>
            </Label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-sm -mt-4">{errors.termsAccepted}</p>
          )}
          
          <Button
            type="submit"
            className="w-full bg-rose-600 hover:bg-rose-500 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Đang xử lý...' : 'Đăng ký'}
          </Button>
        </form>
      </div>
    </div>
  );
}