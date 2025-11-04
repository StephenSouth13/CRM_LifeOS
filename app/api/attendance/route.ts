import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/supabase"; // Dùng khóa Admin/Service Role
import { calculateDistance } from "@/lib/utils/geolocation"; // Hàm Haversine

// Constants
const TODAY_START = new Date().toISOString().split("T")[0] + "T00:00:00";
const TODAY_END = new Date().toISOString().split("T")[0] + "T23:59:59";

/**
 * POST /api/attendance - Create attendance log (check-in/out)
 * Chức năng: Check-in/out với Geolocation Validation
 */
export async function POST(request: NextRequest) {
  let result: any;
  let isLocationValid = false;
  let distanceInMeters = 0;
  let existingLog: any = null;
  let updateData: Record<string, any> = {};

  try {
    const body = await request.json();
    
    // Khai báo và destructure biến ở đầu scope (FIX LỖI SCOPE)
    const {
      user_id,
      org_id,
      type,
      lat, // Tọa độ người dùng
      lon, // Tọa độ người dùng
      project_id, // ID Dự án
    } = body;

    // 1. KIỂM TRA INPUT BẮT BUỘC
    if (!user_id || !org_id || !type || !project_id) { 
      return NextResponse.json(
        { error: "user_id, org_id, type, and project_id are required" },
        { status: 400 },
      );
    }

    if (type !== "check_in" && type !== "check_out") {
      return NextResponse.json(
        { error: "type must be check_in or check_out" },
        { status: 400 },
      );
    }
    
    // 2. LOGIC GEOLOCATION VALIDATION (Chỉ khi Check-in)
    if (type === "check_in" && lat !== undefined && lon !== undefined) {
        
        // Lấy tọa độ hợp lệ từ bảng PROJECTS
        const { data: projectData, error: projectError } = await supabaseAdmin
            .from("projects")
            .select("allowed_latitude, allowed_longitude, allowed_radius_meters")
            .eq("id", project_id)
            .single();

        if (projectError || !projectData || !projectData.allowed_latitude) {
            // Nếu không tìm thấy tọa độ, ghi là không hợp lệ
            isLocationValid = false; 
            console.warn(`Project location not configured for ID: ${project_id}`);
        } else {
            // Áp dụng Haversine Formula
            distanceInMeters = calculateDistance(
                lat, 
                lon,
                projectData.allowed_latitude,
                projectData.allowed_longitude
            );
            
            isLocationValid = distanceInMeters <= projectData.allowed_radius_meters;
        }
    }


    // 3. XÁC ĐỊNH LOGIC INSERT/UPDATE
    
    // Tìm bản ghi Chấm công hôm nay
    const { data: logToday } = await supabaseAdmin
      .from("attendance_logs")
      .select("id, check_out_time")
      .eq("user_id", user_id)
      .eq("org_id", org_id)
      .gte("created_at", TODAY_START)
      .lte("created_at", TODAY_END)
      .maybeSingle(); // Dùng maybeSingle để tránh lỗi 404 khi không tìm thấy
      
    existingLog = logToday;


    if (type === "check_in") {
        if (existingLog) {
             return NextResponse.json({ error: "Check-in already exists for today." }, { status: 400 });
        }
        
        // Dữ liệu Check-in
        updateData = {
            user_id,
            org_id,
            project_id,
            check_in_time: new Date().toISOString(),
            check_in_lat: lat,
            check_in_lon: lon,
            is_location_valid: isLocationValid, // Ghi kết quả kiểm tra Geolocation
        };
        
        // Thực hiện INSERT
        const { data, error } = await supabaseAdmin
            .from("attendance_logs")
            .insert([updateData])
            .select()
            .single();
        result = { data, error };

    } else if (type === "check_out") {
        if (!existingLog || existingLog.check_out_time) {
            return NextResponse.json({ error: "No active Check-in found or already Checked out." }, { status: 400 });
        }
        
        // Dữ liệu Check-out
        updateData = {
            check_out_time: new Date().toISOString(),
            check_out_lat: lat,
            check_out_lon: lon,
        };
        
        // Thực hiện UPDATE
        const { data, error } = await supabaseAdmin
            .from("attendance_logs")
            .update(updateData)
            .eq("id", existingLog.id)
            .select()
            .single();
        result = { data, error };
        
    } else {
        // Trường hợp không phải check_in hoặc check_out (đã được kiểm tra, nhưng để an toàn)
        return NextResponse.json({ error: "Invalid attendance operation." }, { status: 400 });
    }


    // 4. XỬ LÝ LỖI DB & PHẢN HỒI CUỐI CÙNG
    if (result.error) {
      console.error("Attendance DB Error:", result.error.message);
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    if (type === "check_in" && !result.error && isLocationValid === false) {
        return NextResponse.json({
            log: result.data,
            message: `Check-in recorded. WARNING: Location Invalid (${Math.round(distanceInMeters)}m). Needs review.`,
            is_valid: false
        });
    }

    return NextResponse.json({
      log: result.data,
      message: `Checked ${type === "check_in" ? "in" : "out"} successfully`,
      is_valid: true
    });
    
  } catch (error) {
    console.error("Attendance API Fatal Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/attendance - Get attendance logs (RBAC and Filtering)
 */
export async function GET(request: NextRequest) {
 // ... (Logic GET giữ nguyên hoặc sẽ được bổ sung RBAC Server-side sau)
}

/**
 * PUT /api/attendance/:id - Verify/approve attendance
 */
export async function PUT(request: NextRequest) {
 // ... (Logic PUT giữ nguyên)
}