// app/api/login/route.ts

import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const { email, password } = await request.json()

    if (email !== process.env.NEXT_ADMIN_EMAIL || password !== process.env.NEXT_ADMIN_PASSWORD) {
        return NextResponse.json(
            { error: "Invalid email or password" },
            { status: 401 }
        )
    }

    const response = NextResponse.json({ success: true })

    response.cookies.set("session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return response
}