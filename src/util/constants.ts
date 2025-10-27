export const httpStatus = {
  ok: 200, 
  created: 201, 
  noContent: 204,

  badRequest: 400, // Invalid data from client
  unauthorized: 401, // Not logged in
  forbidden: 403, // Logged in, but not allowed (e.g. trying to access another user's file)
  
  notFound: 404, // Resource doesn't exist (e.g. product not found)
  conflict: 409, // Duplicate (e.g. email already taken)

  internalServerError: 500, // Unexpected server crash or bug
  serviceUnavailable: 503, // Server is up but unavailable (e.g. maintenance)
};