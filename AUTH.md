# Authentication Guide

This project uses JWT-based auth with HTTP-only cookies. `access_token` is stored as a cookie after login.

## Signup

Endpoint: `POST /api/auth/signup`

Body example (JSON):

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "profileImageUrl": "http://localhost:3000/uploads/abc.jpg",
  "adminJoinCode": "<ADMIN_JOIN_CODE>" // optional for admin role
}

- `role` automatically becomes `admin` if `adminJoinCode` matches env variable `ADMIN_JOIN_CODE`.
- Without code, role defaults to `user`.

## Signin

Endpoint: `POST /api/auth/signin`

Body example (JSON):

{
  "email": "john@example.com",
  "password": "securePassword123"
}

Successful response:
- HTTP-only cookie `access_token`
- JSON body with user info (no password)

## Signout

Endpoint: `POST /api/auth/signout`

Clears `access_token` cookie.

## Get profile (authenticated)

Endpoint: `GET /api/auth/profile`

Requires valid token.

## Update profile (authenticated)

Endpoint: `PUT /api/auth/update`

Body example (JSON):

{
  "name": "New Name",
  "email": "newemail@example.com",
  "password": "newPassword123"
}

## Upload profile image

Endpoint: `POST /api/auth/upload-image`

Multipart form-data field name: `image`

Response returns `{ imageUrl: "http://..." }`.

---

Use this file together with `README.md` as the authoritative integration and feature documentation for the project.
