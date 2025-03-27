import axios from 'axios';
import crypto from 'crypto';

const MOMO_API_URL = process.env.NEXT_PUBLIC_MOMO_API_URL || 'https://test-payment.momo.vn/v2/gateway/api/create';
const MOMO_PARTNER_CODE = process.env.NEXT_PUBLIC_MOMO_PARTNER_CODE || 'MOMO';
const MOMO_ACCESS_KEY = process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY || 'your_access_key';
const MOMO_SECRET_KEY = process.env.NEXT_PUBLIC_MOMO_SECRET_KEY || 'your_secret_key';
// Enable sandbox mode if no real keys are provided
const IS_SANDBOX_MODE = 
  !process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY || 
  !process.env.NEXT_PUBLIC_MOMO_SECRET_KEY || 
  process.env.NEXT_PUBLIC_MOMO_ACCESS_KEY === 'your_access_key' || 
  process.env.NEXT_PUBLIC_MOMO_SECRET_KEY === 'your_secret_key';

export interface MomoPaymentRequest {
  partnerCode: string;
  partnerName: string;
  storeId: string;
  requestType: string;
  ipnUrl: string;
  redirectUrl: string;
  orderId: string;
  amount: number;
  lang: string;
  orderInfo: string;
  requestId: string;
  extraData: string;
}

export interface MomoPaymentResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl: string;
  deeplink: string;
  qrCodeUrl: string;
  deeplinkWebInApp: string;
}

class MomoService {
  private generateSignature(data: string): string {
    if (IS_SANDBOX_MODE) {
      // Return a mock signature in sandbox mode
      return 'mock_signature_for_sandbox_mode';
    }
    
    return crypto
      .createHmac('sha256', MOMO_SECRET_KEY)
      .update(data)
      .digest('hex');
  }

  async createPayment(
    orderId: string,
    amount: number,
    orderInfo: string,
    redirectUrl: string,
    ipnUrl: string
  ): Promise<MomoPaymentResponse> {
    const requestId = Date.now().toString();
    const requestData: MomoPaymentRequest = {
      partnerCode: MOMO_PARTNER_CODE,
      partnerName: 'Airbnb Clone',
      storeId: 'AirbnbClone',
      requestType: 'captureWallet',
      ipnUrl,
      redirectUrl,
      orderId,
      amount,
      lang: 'vi',
      orderInfo,
      requestId,
      extraData: '',
    };

    const data = JSON.stringify(requestData);
    const signature = this.generateSignature(data);

    if (IS_SANDBOX_MODE) {
      console.log('🔶 Running in SANDBOX mode. No real MoMo API call will be made.');
      // Create a mock response for sandbox mode
      const mockResponse: MomoPaymentResponse = {
        partnerCode: MOMO_PARTNER_CODE,
        orderId,
        requestId,
        amount,
        responseTime: Date.now(),
        message: 'Success (Sandbox Mode)',
        resultCode: 0,
        payUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/momo-sandbox?orderId=${orderId}&amount=${amount}&orderInfo=${encodeURIComponent(orderInfo)}`,
        deeplink: '',
        qrCodeUrl: '',
        deeplinkWebInApp: '',
      };
      return mockResponse;
    }

    try {
      const response = await axios.post<MomoPaymentResponse>(
        MOMO_API_URL,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-Partner-Signature': signature,
            'X-Partner-Access-Key': MOMO_ACCESS_KEY,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('MoMo payment error:', error);
      throw new Error('Không thể tạo thanh toán MoMo');
    }
  }

  async verifyPayment(
    partnerCode: string,
    orderId: string,
    requestId: string,
    amount: number,
    orderInfo: string,
    orderType: string,
    transId: string,
    resultCode: number,
    message: string,
    payType: string,
    responseTime: number,
    extraData: string,
    signature: string
  ): Promise<boolean> {
    if (IS_SANDBOX_MODE) {
      // Always return true in sandbox mode
      console.log('🔶 Sandbox mode: Payment verification always returns true');
      return true;
    }
    
    const data = `${partnerCode}${orderId}${requestId}${amount}${orderInfo}${orderType}${transId}${resultCode}${message}${payType}${responseTime}${extraData}`;
    const calculatedSignature = this.generateSignature(data);
    return calculatedSignature === signature;
  }
}

export const momoService = new MomoService(); 