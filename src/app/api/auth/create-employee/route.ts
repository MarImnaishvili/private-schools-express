import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { email, password, role } = await request.json();

    // Validate input
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Email, password, and role are required" },
        { status: 400 }
      );
    }

    if (role !== "employee" && role !== "admin") {
      return NextResponse.json(
        { error: "Invalid role. Must be 'employee' or 'admin'" },
        { status: 400 }
      );
    }

    // Create server client
    const supabase = await createClient();

    // Check if current user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check user's role
    const { data: userRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || userRole?.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can create employee accounts" },
        { status: 403 }
      );
    }

    // Create admin client with service role key
    const adminClient = createAdminClient();

    // Create new user
    const { data: newUser, error: createError } =
      await adminClient.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
      });

    if (createError) {
      console.error("Error creating user:", createError);
      return NextResponse.json(
        { error: createError.message || "Failed to create user" },
        { status: 500 }
      );
    }

    if (!newUser.user) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: 500 }
      );
    }

    // Assign role to the new user
    const { error: roleInsertError } = await supabase
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role: role,
      });

    if (roleInsertError) {
      console.error("Error assigning role:", roleInsertError);
      // Try to delete the created user if role assignment fails
      await adminClient.auth.admin.deleteUser(newUser.user.id);
      return NextResponse.json(
        { error: "Failed to assign role to user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.user.id,
        email: newUser.user.email,
        role: role,
      },
    });
  } catch (error) {
    console.error("Error in create-employee API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
