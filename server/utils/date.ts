import dayjs from "dayjs";

// ✅ แปลง string → ISO-8601 ที่ Prisma รองรับ
// ตัวอย่าง: 2023-08-15 แปลงเป็น 2023-08-15T00:00:00.000Z
export function toISODate(dateString: string): string {
  return dayjs(dateString).toISOString();
}

// ✅ คืนค่า Date object สำหรับ Prisma
// ตัวอย่าง: 2023-08-15 แปลงเป็น 2023-08-15T00:00:00.000Z (Date object)
export function toDateObject(dateString: string): Date {
  return dayjs(dateString).toDate();
}

// ✅ แปลง Date → string format เดียวกัน (เช่น YYYY-MM-DD)
// ตัวอย่าง: 2023-08-15T00:00:00.000Z แปลงเป็น 2023-08-15
export function formatDate(date: Date | string, format = "YYYY-MM-DD"): string {
  return dayjs(date).format(format);
}

// ✅ แปลง Date → datetime format (เช่น YYYY-MM-DD HH:mm:ss)
// ตัวอย่าง: 2023-08-15T12:34:56.000Z แปลงเป็น 2023-08-15 12:34:56
export function formatDateTime(
  date: Date | string,
  format = "YYYY-MM-DD HH:mm:ss",
): string {
  return dayjs(date).format(format);
}

// ✅ ตรวจสอบว่า input เป็นวันที่ valid หรือไม่
// ตัวอย่าง: 2023-08-15 → true, 2023-02-30 → false
export function isValidDate(dateString: string): boolean {
  return dayjs(dateString).isValid();
}

// ✅ คืนค่า timestamp (ใช้สำหรับ logging หรือ sorting)
// ตัวอย่าง: 2023-08-15T12:34:56.000Z → 1692100496000
export function toTimestamp(date: Date | string): number {
  return dayjs(date).valueOf();
}
