/** 1 point mỗi 10,000₫ chi tiêu */
export const POINT_RATE = 10_000;
/** 100 points = 10,000₫ giảm giá */
export const REDEEM_RATE = 100;
/** Đổi tối đa 30% giá trị đơn hàng */
export const MAX_REDEEM_PERCENT = 30;

export function calcRedeemValue(points: number): number {
  return Math.floor((points / REDEEM_RATE) * 10_000);
}
