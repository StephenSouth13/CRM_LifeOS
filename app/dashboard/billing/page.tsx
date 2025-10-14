"use client"

import { useEffect, useRef, useState } from "react"
import QRCode from "qrcode"
import { Download, Copy, Printer, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

declare module "qrcode" // tránh lỗi TS7016

// ---- Thông tin tài khoản ----
const ACCOUNT_NUMBER = "0001244698984"
const ACCOUNT_NAME = "Quách Thành Long"
const BANK_NAME = "MB Bank"

function buildPayload() {
  return `TÀI_KHOẢN:${ACCOUNT_NUMBER};NGƯỜI_NHẬN:${ACCOUNT_NAME};NGÂN_HÀNG:${BANK_NAME}`
}

export default function BillingPage() {
  const [payload] = useState(buildPayload)
  const [dataUrl, setDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()

  // Generate QR
  useEffect(() => {
    const gen = async () => {
      setLoading(true)
      try {
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, {
            errorCorrectionLevel: "H",
            width: 340,
            margin: 2,
            color: {
              dark: "#0f172a",
              light: "#ffffff",
            },
          })
          const url = canvasRef.current.toDataURL("image/png")
          setDataUrl(url)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    gen()
  }, [payload])

  // Copy info
  const copyAccount = async () => {
    await navigator.clipboard.writeText(`${ACCOUNT_NUMBER} — ${ACCOUNT_NAME} — ${BANK_NAME}`)
    toast({ title: "Đã sao chép!", description: "Số tài khoản đã được sao chép." })
  }

  // Download PNG
  const downloadQR = () => {
    const a = document.createElement("a")
    a.href = dataUrl
    a.download = `VietQR_${ACCOUNT_NUMBER}.png`
    a.click()
  }

  // Print QR
  const printQR = () => {
    const w = window.open("")!
    w.document.write(`
      <html>
        <head>
          <title>In VietQR</title>
          <style>
            body { display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; }
            img { max-width:300px; }
            h2, p { font-family:Arial; text-align:center; margin:4px 0; }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="VietQR" />
          <h2>${ACCOUNT_NAME}</h2>
          <p>${ACCOUNT_NUMBER} - ${BANK_NAME}</p>
        </body>
      </html>
    `)
    w.document.close()
    w.print()
  }

  return (
    <TooltipProvider>
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          VietQR Thanh Toán
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* --- QR Card --- */}
          <Card className="p-6 flex flex-col items-center shadow-lg border border-border/40">
            <div className="w-full flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-semibold">Mã QR chuyển khoản</h2>
                <p className="text-sm text-muted-foreground">
                  Quét bằng app ngân hàng để chuyển nhanh tới
                </p>
              </div>

              <div className="flex gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={copyAccount}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sao chép thông tin</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={downloadQR}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tải QR</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost" onClick={printQR}>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>In QR</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-xl relative">
              <canvas ref={canvasRef} className="rounded bg-white" />
              {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 text-muted-foreground text-sm">
                  Đang tạo mã QR...
                </div>
              )}
            </div>

            <div className="text-center mt-4 space-y-1">
              <p className="text-sm text-muted-foreground">Người nhận</p>
              <h3 className="text-lg font-semibold">{ACCOUNT_NAME}</h3>
              <p className="text-sm text-muted-foreground">
                {ACCOUNT_NUMBER} — {BANK_NAME}
              </p>
            </div>
          </Card>

          {/* --- Info Card --- */}
          <Card className="p-6 space-y-4 border border-border/40">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              <h2 className="font-semibold text-lg">Hướng dẫn thanh toán</h2>
            </div>
            <ol className="list-decimal pl-5 text-sm space-y-2 text-muted-foreground">
              <li>Mở app ngân hàng (MB, Vietcombank, Techcombank,...)</li>
              <li>Chọn “Quét mã QR”</li>
              <li>Đưa camera quét mã trên trang này</li>
              <li>Xác nhận người nhận là <b>{ACCOUNT_NAME}</b></li>
              <li>Nhập số tiền và nội dung chuyển khoản</li>
            </ol>

            <div className="border-t pt-3">
              <p className="text-sm text-muted-foreground">
                Mã này hiện ở dạng <strong>VietQR văn bản</strong>.  
                Nếu bạn cần chuẩn <strong>EMVCo (VietQR chuẩn ngân hàng)</strong>  
                để auto điền thông tin trong app, có thể mở rộng thêm sau.
              </p>
            </div>
          </Card>
        </div>

        <Toaster />
      </div>
    </TooltipProvider>
  )
}
