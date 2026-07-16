import connectDb from "@/lib/db";
import User from "@/model/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    let { name, email, password } = await request.json();
    await connectDb();
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }
    let existUser = await User.findOne({ email });
    if (existUser) {
      return NextResponse.json(
        {
          message: "User Already Exists",
        },
        { status: 400 },
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        {
          message: "Password must be at least 6 character!",
        },
        { status: 400 },
      );
    }

    let hashPassword = await bcrypt.hash(password, 10);

    let user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        message: `Register Error ${error}`,
      },
      { status: 500 },
    );
  }
}
