import axios from "axios";

/** Đổi lỗi axios thành câu tiếng Việt để hiện cho người dùng. */
export function errorMessage(e: unknown, fallback = "Có lỗi xảy ra, thử lại sau") {
  if (axios.isAxiosError(e)) {
    if (!e.response) return "Không kết nối được máy chủ";
    const d = e.response.data as { detail?: unknown; message?: unknown } | undefined;
    const m = typeof d?.detail === "string" ? d.detail : typeof d?.message === "string" ? d.message : null;
    if (m) return m;
    if (e.response.status === 401 || e.response.status === 403) return "Phiên đăng nhập đã hết hạn hoặc không đủ quyền";
  }
  return fallback;
}
