export async function loader() {
  const FAGORD_RUST_API_URL = process.env.FAGORD_RUST_API_DOMAIN || 'http://localhost:8080';
  await fetch(`${FAGORD_RUST_API_URL}/debug/headers`);
  return null;
}
