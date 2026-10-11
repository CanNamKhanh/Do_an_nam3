# Daily Board API

Backend cho **Bảng thông tin hằng ngày**: đăng nhập quản trị viên và quản lý sự kiện (CRUD), kèm một endpoint công khai để bảng thông tin hiển thị lịch mà người xem không cần đăng nhập.

**Công nghệ:** Node.js · Express 5 · TypeScript (strict, không `any`) · Prisma 5 · MySQL · JWT (`jose`) · bcryptjs · zod · helmet · express-rate-limit

## Vị trí trong hệ thống

```
Trình duyệt ──▶ Frontend Next.js (:3000) ──┬──▶ API này, Express (:4000)  ──▶ MySQL
                                           │      đăng nhập, sự kiện
                                           └──▶ Server Python (:8000)
                                                  GET /display (thời tiết)
```

API này **không** phục vụ `/display` (thời tiết) — việc đó do server Python riêng đảm nhận.

## Bắt đầu nhanh

Yêu cầu: Node.js ≥ 20, MySQL đang chạy.

```bash
cp .env.example .env          # sửa DATABASE_URL, JWT_SECRET, ADMIN_*
npm install
npx prisma generate           # sinh Prisma Client
npm run db:migrate -- --name init
npm run db:seed               # tạo tài khoản admin đầu tiên
npm run dev                   # http://localhost:4000/api
```

Kiểm tra nhanh:

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}
```

## Biến môi trường

| Biến             | Bắt buộc | Mặc định                | Ghi chú                                         |
| ---------------- | -------- | ----------------------- | ----------------------------------------------- |
| `DATABASE_URL`   | ✅       | —                       | Ví dụ `mysql://user:pass@localhost:3306/app_db` |
| `JWT_SECRET`     | ✅       | —                       | Chuỗi ngẫu nhiên, **tối thiểu 32 ký tự**        |
| `JWT_EXPIRES_IN` |          | `8h`                    | Thời hạn token                                  |
| `PORT`           |          | `8000`                  | Nên đặt `4000` để không trùng server Python     |
| `HOST`           |          | `0.0.0.0`               |                                                 |
| `CORS_ORIGIN`    |          | `http://localhost:3000` | Nhiều origin cách nhau bằng dấu phẩy            |
| `NODE_ENV`       |          | `development`           |                                                 |
| `ADMIN_EMAIL`    | chỉ seed | —                       | Email admin đầu tiên                            |
| `ADMIN_PASSWORD` | chỉ seed | —                       | **Tối thiểu 8 ký tự**                           |

> `ADMIN_PASSWORD` chỉ có tác dụng khi chạy `npm run db:seed`. Đổi trong `.env` mà không chạy lại seed thì mật khẩu cũ vẫn giữ nguyên.

## Scripts

| Lệnh                 | Việc làm                                                        |
| -------------------- | --------------------------------------------------------------- |
| `npm run dev`        | Chạy dev, tự khởi động lại khi sửa code (`tsx watch`)           |
| `npm run build`      | Biên dịch sang `dist/`                                          |
| `npm start`          | Chạy bản đã build                                               |
| `npm run typecheck`  | Kiểm tra kiểu TypeScript                                        |
| `npm run db:migrate` | Tạo/áp dụng migration khi phát triển                            |
| `npm run db:deploy`  | Áp dụng migration trên môi trường thật                          |
| `npm run db:seed`    | Tạo/cập nhật tài khoản admin từ `ADMIN_EMAIL`, `ADMIN_PASSWORD` |

## API

Base URL: `/api`. Dữ liệu gửi và nhận là JSON. Route cần đăng nhập dùng header `Authorization: Bearer <access_token>`.

| Method | Đường dẫn                  | Đăng nhập | Mô tả                                                    |
| ------ | -------------------------- | --------- | -------------------------------------------------------- |
| GET    | `/health`                  | không     | Kiểm tra server sống                                     |
| POST   | `/auth/login`              | không     | Đăng nhập, giới hạn 10 lần / 15 phút                     |
| GET    | `/auth/me`                 | có        | Thông tin admin hiện tại                                 |
| GET    | `/events/public?from=&to=` | **không** | Lịch đang bật trong khoảng thời gian, cho bảng thông tin |
| GET    | `/events`                  | có        | Danh sách sự kiện, lọc `?isActive=&from=&to=`            |
| GET    | `/events/:id`              | có        | Chi tiết một sự kiện                                     |
| POST   | `/events`                  | có        | Tạo sự kiện                                              |
| PATCH  | `/events/:id`              | có        | Sửa một phần (kể cả chỉ `isActive`)                      |
| DELETE | `/events/:id`              | có        | Xóa, trả `204`                                           |

### Đăng nhập

```http
POST /api/auth/login
Content-Type: application/json

{ "email": "admin@congty.vn", "password": "********" }
```

```json
{
  "access_token": "eyJhbGciOi...",
  "token_type": "bearer",
  "user": { "id": 1, "email": "admin@congty.vn", "name": "Quản trị viên" }
}
```

### Sự kiện

Trường của một sự kiện:

| Trường        | Kiểu             | Quy tắc                                                  |
| ------------- | ---------------- | -------------------------------------------------------- |
| `title`       | string           | Bắt buộc, tối đa 255 ký tự                               |
| `description` | string \| null   | Tối đa 5000 ký tự; chuỗi rỗng được lưu thành `null`      |
| `location`    | string \| null   | Tối đa 255 ký tự                                         |
| `startTime`   | ISO 8601         | Bắt buộc, kèm múi giờ, ví dụ `2026-10-12T08:30:00+07:00` |
| `endTime`     | ISO 8601 \| null | Không bắt buộc; phải **không sớm hơn** `startTime`       |
| `isActive`    | boolean          | Mặc định `true`; `false` = ẩn khỏi bảng thông tin        |

```bash
TOKEN=$(curl -s localhost:4000/api/auth/login -H 'content-type: application/json' \
  -d '{"email":"admin@congty.vn","password":"..."}' | jq -r .access_token)

curl -s localhost:4000/api/events -H "authorization: Bearer $TOKEN" \
  -H 'content-type: application/json' \
  -d '{"title":"Giao ban","location":"Phòng họp A","startTime":"2026-10-12T08:30:00+07:00"}'
```

### Endpoint công khai cho bảng thông tin

`GET /api/events/public?from=<ISO>&to=<ISO>` — **cả `from` và `to` đều bắt buộc**. Chỉ trả sự kiện `isActive = true` có `startTime` nằm trong khoảng, sắp theo giờ bắt đầu, và chỉ gồm các trường hiển thị (`id, title, description, location, startTime, endTime, isActive`). Không lộ `createdById` hay thời gian tạo.

### Định dạng lỗi

Mọi lỗi đều có dạng `{ "message": "..." }`:

| Mã  | Khi nào                                                  |
| --- | -------------------------------------------------------- |
| 400 | Dữ liệu sai (kèm `issues: [{ path, message }]`)          |
| 401 | Thiếu/sai/hết hạn token, hoặc sai email/mật khẩu         |
| 404 | Không tìm thấy sự kiện hoặc đường dẫn                    |
| 409 | Dữ liệu trùng                                            |
| 429 | Đăng nhập sai quá nhiều lần                              |
| 500 | Lỗi máy chủ (chi tiết chỉ ghi ở log, không trả ra ngoài) |

## Cấu trúc thư mục

```
prisma/
  schema.prisma          User, Event, SystemSetting
  seed.ts                tạo admin đầu tiên
src/
  config/env.ts          đọc và kiểm tra biến môi trường bằng zod
  lib/                   prisma, jwt, password, http-error
  middlewares/           authenticate, error-handler
  modules/
    auth/                schema → service → controller → routes
    events/              schema → service → controller → routes
  types/express.d.ts     khai báo req.user
  app.ts                 lắp middleware và router
  server.ts              listen + tắt êm
```

Luồng xử lý một yêu cầu: `routes → controller (parse zod) → service (Prisma) → errorHandler`. Mọi đầu vào (body, query, params, env) đều đi qua zod.

## Mô hình dữ liệu

- **User** — mọi tài khoản trong bảng này đều là quản trị viên (không có role). Không có endpoint đăng ký; chỉ tạo bằng `db:seed`.
- **Event** — sự kiện, thuộc về một `User` (`createdById`), xóa user thì xóa luôn các sự kiện của họ.
- **SystemSetting** — một dòng duy nhất (`id = 1`): tên cơ quan, địa điểm, tọa độ. Bảng đã có trong schema nhưng **API này chưa có endpoint `/settings`**.

## Bảo mật

- Mật khẩu băm bằng bcrypt (12 vòng); thông báo đăng nhập sai không tiết lộ email có tồn tại hay không.
- JWT ký HS256, hết hạn theo `JWT_EXPIRES_IN`; mỗi yêu cầu có token đều được kiểm tra lại tài khoản còn tồn tại.
- `helmet`, CORS giới hạn theo `CORS_ORIGIN`, body JSON tối đa 100 KB, giới hạn tốc độ cho `/auth/login`.
- Đổi `JWT_SECRET` và `ADMIN_PASSWORD` trước khi triển khai thật.

## Xử lý sự cố

| Triệu chứng                                             | Nguyên nhân thường gặp                                                           |
| ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `401 Email hoặc mật khẩu chưa đúng` dù nhập đúng        | Chưa seed admin (mật khẩu seed phải ≥ 8 ký tự), hoặc gõ sai email                |
| `401 Thiếu token đăng nhập` ở `/events/public`          | Route `/public` đang nằm **sau** `eventRouter.use(authenticate)`; phải đặt trước |
| `400 Mã sự kiện không hợp lệ` ở `/events/public`        | Route `/public` nằm sau `/:id`; phải đặt trước                                   |
| `429` khi đăng nhập                                     | Sai quá 10 lần trong 15 phút; chờ hoặc khởi động lại server                      |
| `Cannot find module '@prisma/client'` / lỗi kiểu Prisma | Chưa chạy `npx prisma generate`                                                  |
| Lỗi kết nối DB khi khởi động                            | Sai `DATABASE_URL` hoặc MySQL chưa chạy                                          |
