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
    const body = await request.json();
    const { orderId, amount, orderInfo } = body;

    // Tạo URL redirect và IPN URL
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`;
    const ipnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/momo/ipn`;

    // Tạo thanh toán MoMo
    const paymentResponse = await momoService.createPayment(
      orderId,
      amount,
      orderInfo,
      redirectUrl,
      ipnUrl
    );

    return NextResponse.json(paymentResponse);
  } catch (error) {
    console.error('MoMo payment error:', error);
    return NextResponse.json(
      { error: 'Không thể tạo thanh toán MoMo' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    
    if (IS_SANDBOX_MODE) {
      // Trong chế độ sandbox, luôn chuyển hướng đến trang thành công
      console.log('🔶 Sandbox mode: Always redirecting to success page');
      return NextResponse.redirect(new URL('/payment/success', request.url));
    }
    
    // Lấy các tham số từ URL callback
    const partnerCode = searchParams.get('partnerCode');
    const orderId = searchParams.get('orderId');
    const requestId = searchParams.get('requestId');
    const amount = Number(searchParams.get('amount'));
    const orderInfo = searchParams.get('orderInfo');
    const orderType = searchParams.get('orderType');
    const transId = searchParams.get('transId');
    const resultCode = Number(searchParams.get('resultCode'));
    const message = searchParams.get('message');
    const payType = searchParams.get('payType');
    const responseTime = Number(searchParams.get('responseTime'));
    const extraData = searchParams.get('extraData');
    const signature = searchParams.get('signature');

    if (!partnerCode || !orderId || !requestId || !amount || !orderInfo || 
        !orderType || !transId || !resultCode || !message || !payType || 
        !responseTime || !extraData || !signature) {
      return NextResponse.json(
        { error: 'Thiếu thông tin thanh toán' },
        { status: 400 }
      );
    }

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
      return NextResponse.redirect(new URL('/bookings', request.url));
    } else {
      // Thanh toán thất bại
      return NextResponse.redirect(new URL('/payment/failed', request.url));
    }
  } catch (error) {
    console.error('MoMo payment verification error:', error);
    return NextResponse.json(
      { error: 'Lỗi xác thực thanh toán' },
      { status: 500 }
    );
  }
} 