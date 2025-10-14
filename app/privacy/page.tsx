// This is a client component to enable animations with Framer Motion
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileText, Info, Lock, Eye, Users, Gavel, CalendarCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Giả sử đường dẫn components của bạn là @/components/ui
import { Separator } from "@/components/ui/separator"; // Thêm Separator từ shadcn/ui

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const PrivacyPolicyPage = () => {
  // Định nghĩa theme màu xanh ngọc bích/xanh teal tinh tế hơn
  const sophisticatedJadeTheme = {
    primaryText: "text-emerald-700 dark:text-emerald-300",
    secondaryText: "text-emerald-600 dark:text-emerald-400",
    accentText: "text-cyan-600 dark:text-cyan-400",
    bgLight: "bg-gradient-to-br from-emerald-50 via-cyan-50 to-indigo-50 dark:from-slate-900 dark:via-gray-950 dark:to-emerald-950",
    cardBg: "bg-white/90 dark:bg-gray-800/90",
    cardBorder: "border border-emerald-300/30 dark:border-emerald-700/30",
    shadow: "shadow-xl shadow-emerald-200/20 dark:shadow-emerald-900/20",
    iconColor: "text-cyan-500 dark:text-emerald-400",
  };

  const policySections = [
    {
      title: "1. Thông tin chúng tôi thu thập",
      icon: Info,
      content: (
        <>
          <p>
            Chúng tôi thu thập các thông tin cần thiết để cung cấp và cải thiện dịch vụ, bao gồm:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Thông tin tài khoản:</strong> Tên, email, mật khẩu (đã mã hóa), vai trò (Owner, Admin, Leader, Staff) khi bạn đăng ký.
            </li>
            <li>
              <strong>Dữ liệu hoạt động:</strong> Dữ liệu chấm công (giờ check-in/out), thông tin công việc (tasks), lịch biểu (events), ghi chú (notes), và các yêu cầu (ví dụ: xin nghỉ phép).
            </li>
            <li>
              <strong>Thông tin kỹ thuật:</strong> Địa chỉ IP, loại trình duyệt, hệ điều hành, và dữ liệu sử dụng hệ thống để phân tích và cải thiện trải nghiệm người dùng.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "2. Cách chúng tôi sử dụng thông tin",
      icon: CalendarCheck,
      content: (
        <>
          <p>
            Thông tin của bạn được sử dụng cho các mục đích sau:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cung cấp, vận hành và duy trì hệ thống Life OS.</li>
            <li>Quản lý tài khoản, phân quyền truy cập dựa trên vai trò (RBAC).</li>
            <li>Xử lý các yêu cầu của bạn, như chấm công, quản lý công việc, và phê duyệt.</li>
            <li>Giao tiếp với bạn, bao gồm gửi thông báo hệ thống và hỗ trợ người dùng.</li>
            <li>Cải thiện và cá nhân hóa trải nghiệm của bạn trên Life OS.</li>
            <li>Đảm bảo an ninh và ngăn chặn gian lận.</li>
          </ul>
        </>
      ),
    },
    {
      title: "3. Chia sẻ thông tin",
      icon: Users,
      content: (
        <>
          <p>
            Chúng tôi không bán, trao đổi, hoặc chuyển giao thông tin cá nhân của bạn cho bên thứ ba ngoại trừ các trường hợp:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Trong tổ chức của bạn:</strong> Dữ liệu của bạn có thể được chia sẻ với các thành viên khác trong tổ chức của bạn dựa trên vai trò và quyền hạn được cấu hình (ví dụ: Leader xem được công việc của Staff trong team).
            </li>
            <li>
            <li>
              <strong>Bên cung cấp dịch vụ:</strong> Chúng tôi có thể chia sẻ thông tin với các đối tác tin cậy hỗ trợ chúng tôi vận hành hệ thống (ví dụ: nhà cung cấp dịch vụ lưu trữ đám mây), nhưng chỉ trong phạm vi cần thiết và cam kết bảo mật.
            </li>
              <strong>Yêu cầu pháp lý:</strong> Khi được yêu cầu bởi pháp luật hoặc để bảo vệ quyền lợi hợp pháp của chúng tôi.
            </li>
          </ul>
        </>
      ),
    },
    {
      title: "4. Bảo mật dữ liệu",
      icon: Lock,
      content: (
        <p>
          Chúng tôi thực hiện các biện pháp bảo mật nghiêm ngặt để bảo vệ dữ liệu của bạn. Điều này bao gồm mã hóa dữ liệu, kiểm soát truy cập chặt chẽ (RBAC), sử dụng SSL/TLS cho kết nối, và thường xuyên rà soát các lỗ hổng bảo mật.
        </p>
      ),
    },
    {
      title: "5. Quyền của bạn",
      icon: Eye,
      content: (
        <p>
          Bạn có quyền truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình. Vui lòng liên hệ với quản trị viên hệ thống (Admin/Owner) trong tổ chức của bạn hoặc liên hệ với chúng tôi qua thông tin hỗ trợ để thực hiện các quyền này.
        </p>
      ),
    },
    {
      title: "6. Thay đổi chính sách",
      icon: Gavel,
      content: (
        <p>
          Chúng tôi có thể cập nhật Chính sách Bảo mật này theo thời gian. Mọi thay đổi sẽ được thông báo trên trang này. Chúng tôi khuyến khích bạn xem lại định kỳ để nắm được thông tin mới nhất và hiểu rõ cách chúng tôi bảo vệ thông tin của bạn.
        </p>
      ),
    },
  ];

  return (
    <motion.div
      className={`min-h-screen ${sophisticatedJadeTheme.bgLight} py-12 px-4 md:px-8 flex justify-center items-center`}
    >
      <motion.div
        className="container mx-auto max-w-5xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className={`${sophisticatedJadeTheme.cardBg} ${sophisticatedJadeTheme.cardBorder} ${sophisticatedJadeTheme.shadow} backdrop-blur-sm transition-all duration-300 hover:shadow-2xl`}>
            <CardHeader className="text-center pb-6 md:pb-8">
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
                >
                  <ShieldCheck className={`${sophisticatedJadeTheme.iconColor} h-20 w-20 p-2 rounded-full bg-emerald-100/50 dark:bg-emerald-800/50`} />
                </motion.div>
              </div>
              <CardTitle className={`text-4xl font-extrabold ${sophisticatedJadeTheme.primaryText} leading-tight`}>
                Chính sách Bảo mật của Life OS
              </CardTitle>
              <CardDescription className="text-lg text-gray-600 dark:text-gray-400 mt-2">
                Cam kết mạnh mẽ của chúng tôi trong việc bảo vệ dữ liệu và quyền riêng tư của bạn.
              </CardDescription>
            </CardHeader>

            <CardContent className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-8 md:space-y-10">
              <motion.p variants={itemVariants} className="lead text-xl text-center font-medium leading-relaxed">
                Chào mừng bạn đến với Life OS. Chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn một cách tối đa. Chính sách Bảo mật này được tạo ra để cung cấp sự minh bạch tuyệt đối về cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn khi bạn tương tác với hệ thống tiên tiến của chúng tôi.
              </motion.p>
              <Separator className="bg-emerald-200/50 dark:bg-emerald-700/50" />

              {policySections.map((section, index) => (
                <motion.div key={index} variants={itemVariants} className="group transition-all duration-300 ease-in-out">
                  <h2 className={`text-2xl font-bold mb-3 flex items-center ${sophisticatedJadeTheme.secondaryText} group-hover:${sophisticatedJadeTheme.accentText} transition-colors duration-300`}>
                    <section.icon className={`${sophisticatedJadeTheme.iconColor} mr-3 h-7 w-7 flex-shrink-0 group-hover:rotate-6 transition-transform duration-300`} />
                    {section.title}
                  </h2>
                  <div className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                    {section.content}
                  </div>
                </motion.div>
              ))}

              <Separator className="bg-emerald-200/50 dark:bg-emerald-700/50" />

              <motion.div variants={itemVariants} className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between text-sm text-gray-600 dark:text-gray-400 bg-emerald-50/50 dark:bg-gray-800/50 p-4 rounded-lg">
                <div className="flex items-center space-x-2 mb-2 md:mb-0">
                  <FileText className={`${sophisticatedJadeTheme.accentText} h-5 w-5`} />
                  <span>Phiên bản cuối cùng được cập nhật: </span>
                  <span className="font-semibold text-emerald-800 dark:text-emerald-200">14 tháng 10, 2025</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarCheck className={`${sophisticatedJadeTheme.accentText} h-5 w-5`} />
                  <span>Duy trì bởi đội ngũ Life OS</span>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyPolicyPage;