# Bảng thông tin hằng ngày — Frontend

Dashboard hiển thị cho cơ quan/công ty: đồng hồ, **thời tiết hiện tại**, **lịch hôm nay** và **lịch 7 ngày tới**. Nền trang đổi theo thời tiết, có hiệu ứng mưa/tuyết/sao/sương/mây và một cảnh phố nhỏ chuyển động. Người xem **không cần đăng nhập**; chỉ trang quản trị mới cần.

**Công nghệ:** Next.js 14 (App Router) · React 18 · TypeScript · Tailwind CSS 3 · axios · zod. Frontend **không có database hay Prisma** — mọi dữ liệu và xác thực đều đi qua API của backend.

## Vị trí trong hệ thống

```
Trình duyệt ──▶ Next.js (:3000)
                  │  (gọi từ server của Next, không dính CORS)
                  ├──▶ Express (:4000)   đăng nhập, sự kiện, cài đặt   ──▶ MySQL
                  └──▶ Python  (:8000)   GET /display  (thời tiết)
```

## Tính năng

**Bảng thông tin (`/`)**

- Đồng hồ lớn, lời chào theo giờ, ngày tháng tiếng Việt.
- Thẻ thời tiết: nhiệt độ, cảm giác như, độ ẩm, gió, khả năng mưa, cao/thấp trong ngày.
- Nền theo thời tiết và giờ trong ngày (8 kiểu): trời quang ngày/đêm, nhiều mây ngày/đêm, sương mù, mưa, tuyết, dông bão.
- Dòng thời gian trong ngày (6h–22h) với vạch sự kiện và mốc hiện tại.
- **Lịch hôm nay**: nhãn "Đang diễn ra" và "Sắp tới · sau N phút"; sự kiện đã qua được làm mờ.
- **Lịch tuần**: 7 ngày tới, mỗi ngày một hàng (tối đa 4 sự kiện/ngày).
- Nút toàn màn hình cho màn hình treo tường.
- Tự tắt chuyển động khi hệ điều hành bật "giảm chuyển động".

**Quản trị (`/admin`)**

- Đăng nhập bằng tài khoản do backend cấp (token lưu trong cookie `httpOnly`).
- Thêm sự kiện (ngày và giờ ở hai ô riêng), ẩn/hiện, xóa.
- Cài đặt chung: tên cơ quan, địa điểm, tọa độ.

## Bắt đầu nhanh

Yêu cầu: Node.js ≥ 20, backend Express và server Python đang chạy.

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

Sau khi sửa biến môi trường phải **tắt và chạy lại** `npm run dev` (Next chỉ đọc biến lúc khởi động).

### Biến môi trường

| Biến              | Mặc định                    | Dùng cho                             |
| ----------------- | --------------------------- | ------------------------------------ |
| `BACKEND_API_URL` | `http://localhost:4000/api` | Express: đăng nhập, sự kiện, cài đặt |
| `DISPLAY_API_URL` | `http://localhost:8000/api` | Python: `GET /display` (thời tiết)   |

Hai biến này trỏ tới **hai server khác nhau**. Nhầm lẫn giữa chúng là lỗi dễ gặp nhất: nếu `BACKEND_API_URL` trỏ vào server Python thì đăng nhập sẽ luôn báo sai mật khẩu.

### Scripts

| Lệnh                          | Việc làm                                  |
| ----------------------------- | ----------------------------------------- |
| `npm run dev`                 | Chạy dev                                  |
| `npm run build` / `npm start` | Build và chạy production                  |
| `npm run lint`                | Kiểm tra kiểu TypeScript (`tsc --noEmit`) |

### Xem thử nền thời tiết

Thêm `?preview=<mã>` vào địa chỉ để giả lập thời tiết:

| Mã   | Nền        | Mã   | Nền      |
| ---- | ---------- | ---- | -------- |
| `0`  | Trời quang | `63` | Mưa      |
| `3`  | Nhiều mây  | `75` | Tuyết    |
| `45` | Sương mù   | `95` | Dông bão |

Ví dụ: `http://localhost:3000/?preview=95`. Nền ngày hay đêm lấy theo giờ máy.

## Luồng dữ liệu

```
Thời tiết    useDisplay ─▶ /api/display (route Next) ─▶ DISPLAY_API_URL/display
Lịch 7 ngày  useWeekEvents ─▶ /api/events (route Next) ─▶ BACKEND_API_URL/events/public
Đăng nhập    Server Action ─▶ BACKEND_API_URL/auth/login   (token → cookie httpOnly)
Quản trị     Server Action + Bearer token ─▶ BACKEND_API_URL/events, /settings
```

Trình duyệt chỉ gọi các route `/api/*` cùng origin của Next; Next mới gọi tiếp sang backend, nên không vướng CORS và không lộ địa chỉ backend.

Tần suất làm mới: thời tiết theo `poll_hint_seconds` của `/display` (tối thiểu 10 giây), lịch sự kiện mỗi 30 giây. Khi lỗi, giao diện giữ dữ liệu cũ và thử lại.

## Hợp đồng API mà frontend cần

**Backend Express** (`BACKEND_API_URL`)

| Endpoint                                                                 | Đăng nhập            | Dùng ở                         |
| ------------------------------------------------------------------------ | -------------------- | ------------------------------ |
| `POST /auth/login` → `{ access_token }`                                  | không                | `services/auth.service.ts`     |
| `GET /auth/me` → `{ id, email, name }`                                   | có                   | `services/auth.service.ts`     |
| `GET /events/public?from=&to=`                                           | **không**            | route `/api/events`            |
| `GET /events`, `POST /events`, `PATCH /events/:id`, `DELETE /events/:id` | có                   | `services/events.service.ts`   |
| `GET /settings`, `PUT /settings`                                         | GET: không · PUT: có | `services/settings.service.ts` |

> Nếu backend chưa có `/settings`, trang vẫn chạy với tên cơ quan/địa điểm mặc định, nhưng nút "Lưu cài đặt" sẽ báo lỗi.

**Server Python** (`DISPLAY_API_URL`) — `GET /display` trả JSON; frontend dùng các trường:

```jsonc
{
  "weather": {
    "location": "Hà Nội",
    "current": {
      "temperature_2m": 25.6,
      "relative_humidity_2m": 63,
      "apparent_temperature": 28.2,
      "weather_code": 0,
      "weather_text": "Trời quang",
      "weather_icon": "sun",
      "wind_speed_10m": 2.3,
    },
    "daily": {
      "temperature_2m_max": 28.9,
      "temperature_2m_min": 20.2,
      "precipitation_probability_max": 0,
    },
    "stale": false,
    "age_minutes": 2.0,
  },
  "poll_hint_seconds": 30,
}
```

`weather_code` theo bảng mã WMO (Open-Meteo) và quyết định nền (xem `lib/weather.ts`). Trường `events` trong `/display` (nếu có) **không được dùng**; lịch lấy từ Express.

## Cấu trúc thư mục

```
src/
  app/
    page.tsx                  bảng thông tin
    admin/page.tsx            trang quản trị (yêu cầu đăng nhập)
    admin/login/page.tsx      đăng nhập
    api/display/route.ts      proxy → Python /display
    api/events/route.ts       proxy → Express /events/public
    layout.tsx, globals.css   font, Tailwind, CSS cảnh phố
  actions/                    Server Actions: auth, events, settings (validate bằng zod)
  services/                   gọi API: display, backend, auth, events, events.client, settings
  lib/
    http/                     client.ts (trình duyệt), server.ts (server), errors.ts
    auth.ts                   đọc/ghi cookie phiên, getSession, requireAdmin
    weather.ts                bảng mã thời tiết, màu nền, cấu hình MEDIA
    utils.ts                  cn, định dạng giờ, lời chào, đếm ngược
  hooks/                      useDisplay, useWeekEvents, useClock
  components/
    dashboard/                Dashboard, Clock, WeatherCard, EventList, WeekAgenda,
                              DayTimeline, WeatherBackground, WeatherFx, StreetScene, icons
    admin/                    LoginForm, EventForm, EventTable, SettingsForm
    ui/                       Field, DateTimeField, SubmitButton
  types/                      display, auth, action
```

## Tùy biến

- **Ảnh/video nền thật:** đặt file vào `public/media/`, rồi khai báo trong `MEDIA` ở `src/lib/weather.ts`, ví dụ `fog: { video: "/media/fog.mp4", image: "/media/fog.jpg" }`. Hiệu ứng mưa/tuyết/sao vẫn chạy chồng lên.
- **Số ngày của lịch tuần:** đổi `WEEK_DAYS` trong `src/services/events.client.ts`.
- **Số sự kiện hiện mỗi ngày:** đổi `MAX_PER_DAY` trong `components/dashboard/WeekAgenda.tsx`.
- **Giờ hiển thị trên dòng thời gian:** đổi `START`, `END` trong `components/dashboard/DayTimeline.tsx`.
- **Quy ước giao diện:** bo góc nhỏ (`rounded-md`), mọi nút/liên kết đều có `cursor-pointer`.

## Xử lý sự cố

| Triệu chứng                                                        | Nguyên nhân thường gặp                                                                                                        |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- |
| Đăng nhập luôn báo "Email hoặc mật khẩu chưa đúng"                 | `BACKEND_API_URL` đang trỏ vào server Python, hoặc nhập sai email; kiểm tra `.env.local` rồi chạy lại `npm run dev`           |
| Đăng nhập xong bị đưa về trang login                               | Code còn kiểm tra `role`; backend không còn trả `role`, chỉ cần có phiên hợp lệ                                               |
| Ô "Lịch hôm nay" báo "Không tải được lịch" (`/api/events` trả 502) | Backend Express chưa chạy, sai `BACKEND_API_URL`, hoặc backend chưa có `/events/public`                                       |
| Lịch trống dù database có sự kiện                                  | Sự kiện nằm ngoài 7 ngày tới, hoặc đang ở trạng thái ẩn; kiểm tra ngày (ô ngày của trình duyệt có thể theo thứ tự tháng/ngày) |
| Không thấy nền hay cảnh phố                                        | `body` có màu nền che mất các lớp phía sau; chỉ đặt nền ở thẻ `html` trong `globals.css`                                      |
| Thời tiết trống                                                    | Server Python chưa chạy hoặc sai `DISPLAY_API_URL`                                                                            |
| "Lưu cài đặt" báo lỗi                                              | Backend chưa có `PUT /settings`                                                                                               |
| Thông báo "Please fill out this field" ở ô giờ                     | Ô ngày/giờ chưa điền đủ cả hai                                                                                                |
