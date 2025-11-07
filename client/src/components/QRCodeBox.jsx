import { QRCodeSVG as QRCode } from 'qrcode.react'

export default function QRCodeBox({ value, id }) {
  if (!value) return null
  return (
    <div className="p-4 bg-white rounded-lg inline-block">
      <QRCode id={id} value={value} size={160} includeMargin={true} />
    </div>
  )
}
