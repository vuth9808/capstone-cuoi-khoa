import { NextResponse } from 'next/server';
import { momoService } from '@/services/momo.service';

// Enable sandbox mode if no real keys are provided
const IS_SANDBOX_MODE = 
  !process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY || 
  !process.env.NEXT_PUBLIC_MOMO_SECRET_KEY || 
  process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY === 'your_access_key' || 
  process.env.NEXT_PUBLIC_MOMO_SECRET_KEY === 'your_secret_key';

export async function POST(request: Request) {
  try {
    if (IS_SANDBOX_MODE) {
      // In sandbox mode, always return success
      console.log('🔶 Sandbox mode: IPN always returns success');
      return NextResponse.json({ message: 'Thanh toán thành công (Sandbox Mode)' });
    }
    
    const body = await request.json();
    
    // Lấy các tham số từ IPN
    const {
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    } = body;

    // Xác thực chữ ký
    const isValid = await momoService.verifyPayment(
      partnerCode,
      orderId,
      requestId,
      amount,
      orderInfo,
      orderType,
      transId,
      resultCode,
      message,
      payType,
      responseTime,
      extraData,
      signature
    );

    if (!isValid) {
      return NextResponse.json(
        { error: 'Chữ ký không hợp lệ' },
        { status: 400 }
      );
    }

    // Xử lý kết quả thanh toán
    if (resultCode === 0) {
      // Thanh toán thành công
      // TODO: Cập nhật trạng thái đơn hàng trong database
      // TODO: Gửi email xác nhận cho khách hàng
      return NextResponse.json({ message: 'Thanh toán thành công' });
    } else {
      // Thanh toán thất bại
      // TODO: Cập nhật trạng thái đơn hàng trong database
      return NextResponse.json({ message: 'Thanh toán thất bại' });
    }
  } catch (error) {
    console.error('MoMo IPN error:', error);
    return NextResponse.json(
      { error: 'Lỗi xử lý IPN' },
      { status: 500 }
    );
  }
} 