export default defineEventHandler(async (event) => {
  return {
    statusCode: 200,
    statusMessage: "Hello from the auth API!",
  };
});
