
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { email, password } = await request.json();

    const isValid = email && password;

    if (!isValid) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    
    (await cookies()).set("user_email", email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ success: true, email });
}