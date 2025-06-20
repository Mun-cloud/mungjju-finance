export interface SpendingList {
  _id: number;
  s_date: string; // 작성일자
  s_time: string; // 작성시간
  s_where: string; // 지출내역
  s_memo: string; // 메모
  s_card: string;
  s_cate: string;
  category_name: string; // 카테고리
  s_subcate: string;
  subcategory_name: string; // 서브 카테고리
  s_price: number; // 소비 금액
  s_cardmonth: string;
  s_ipter: string;
  s_oraw: string;
}
