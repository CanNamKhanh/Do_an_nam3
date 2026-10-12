export interface Session {
  id: number;
  email: string;
  name?: string | null;
  role: "USER" | "ADMIN";
}
