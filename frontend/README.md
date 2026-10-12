# Bảng thông tin hằng ngày & thời tiết (Next.js 14 + Tailwind)

## Chạy dự án
```bash
cp .env.example .env        # sửa DATABASE_URL, AUTH_SECRET, ADMIN_PASSWORD
npm install
npm run db:push             # tạo bảng theo prisma/schema.prisma
npm run db:seed             # tạo tài khoản ADMIN + SystemSetting
npm run dev                 # http://localhost:3000
```
Xem thử nền: `/?preview=0|3|45|63|75|95` (quang, mây, sương, mưa, tuyết, bão).

## Luồng dữ liệu
```
Trình duyệt ──axios──▶ /api/display (Next route) ──axios──▶ http://0.0.0.0:8000/api/display
```
- Trình duyệt không gọi thẳng :8000 để tránh CORS và vì `0.0.0.0` không phải địa chỉ truy cập được từ máy khác.
- Đổi địa chỉ backend bằng `BACKEND_API_URL` trong `.env`.
- Backend :8000 và trang quản trị Next dùng chung một DB: admin ghi Event/SystemSetting bằng Prisma, backend đọc DB và trả `events` trong `/display`.

## Cấu trúc
```
prisma/            schema + seed
src/app/           page.tsx (dashboard), admin/, api/display/route.ts (proxy)
src/actions/       Server Actions: auth, events, settings
src/services/      display (client axios), backend (server axios), events, settings (Prisma)
src/lib/           http/ (axios), auth (JWT cookie), prisma, weather (mã WMO, theme), utils
src/hooks/         useDisplay (polling), useClock
src/components/    dashboard/ (Clock, WeatherCard, EventList, DayTimeline, WeatherBackground, WeatherFx, StreetScene), admin/, ui/
```

## Nền video/ảnh thật
Đặt file vào `public/media/` rồi khai báo trong `MEDIA` ở `src/lib/weather.ts`, ví dụ `fog: { video: "/media/fog.mp4", image: "/media/fog.jpg" }`.
